import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Inventory, Item } from '../../types/items';
import { Ship } from '../../types/ship';
import { BoardAction } from '../../types/action';
import { Upgrade } from '../../types/upgrades';
import { User } from '../../types/user';
import { c } from '../../utility/c';
import { calculateIncome } from '../../utility/calculateIncome';
import { items } from '../../utility/itemsData';
import { SettingsState } from '../settings/settingsSlice';

export type UpgradeLevel = 'movement' | 'pillage' | 'ship' | 'range';

interface GameState {
  /**
   * Increment the game version when breaking changes are made to the game state object.
   * This will prevent bugs when we restore a game from localStorage.
   */
  version: number;
  /**
   * Stores the amount of available cash
   */
  cash: number;
  /**
   * An array of ships
   */
  ships: Ship[];
  /**
   * The ID of the ship you are adding segments to
   */
  editingShip?: number;
  /**
   * The temporary ship in memory before being built
   */
  temporaryShip?: Ship;
  /**
   * Whether or not clicking squares means you are placing
   * down new segments or not.
   */
  placeMode: boolean;
  /**
   * Hides your placed ships, incase you're playing near some sketchy people.
   */
  shipsVisible: boolean;
  levels: Record<UpgradeLevel, number>;
  /**
   * Records any items the player has purchased
   */
  inventory: Inventory;
  skip: number;
  actions: BoardAction[];
  /**
   * Records buyable items
   */
  store: Item[];
  users: {
    self: User;
    opponents: User[];
  };
}

const initialState: GameState = {
  version: 12,
  cash: 0,
  ships: [],
  placeMode: false,
  shipsVisible: true,
  levels: {
    movement: 0,
    pillage: 0,
    ship: 0,
    range: 0,
  },
  inventory: {
    segment: 10,
    missile: Infinity,
    ranged: 0,
    longranged: 0,
    bomb: 0,
    directional: 0,
    atomic: 0,
  },
  skip: 1,
  store: items,
  actions: [],
  users: {
    self: {
      name: 'Me',
      initial: 'Me',
      id: Date.now(),
    },
    opponents: [],
  },
};

let savedState: GameState | undefined;
try {
  savedState = JSON.parse(localStorage.getItem('game') as string) as GameState;
  if (savedState.version !== initialState.version) {
    savedState = undefined;
  }
} catch (e) {
  // no game/data saved
}

export const gameSlice = createSlice({
  name: 'game',
  initialState: savedState || initialState,
  reducers: {
    togglePlaceMode: (state) => {
      state.placeMode = !state.placeMode;
      delete state.temporaryShip;
      delete state.editingShip;
    },
    toggleShipVisibility: (state) => {
      state.shipsVisible = !state.shipsVisible;
    },
    skipTurn: (state) => {
      state.cash = c(state.cash - state.skip);
      state.skip = state.skip + 1;
    },
    addShip: (state, action: PayloadAction<Ship>) => {
      state.ships.push(action.payload);
      delete state.editingShip;
    },
    selectShip: (state, action: PayloadAction<number | undefined>) => {
      state.editingShip = action.payload;
    },
    setTemporaryShip: (state, action: PayloadAction<Ship | undefined>) => {
      state.temporaryShip = action.payload;
    },
    saveTemporaryShip: (state, action: PayloadAction) => {
      if (!state.temporaryShip) {
        return;
      }
      state.inventory.segment -= state.temporaryShip.segments.filter((s) => s.new).length;
      state.temporaryShip.segments = state.temporaryShip.segments.map((s) => ({ x: s.x, y: s.y }));
      state.ships = state.ships.filter((s) => s.id !== state.editingShip);
      state.ships.push(state.temporaryShip);
      state.temporaryShip = undefined;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.opponents.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users.opponents = state.users.opponents.filter(({ id }) => id !== action.payload);
    },
    editMe: (state, action: PayloadAction<User>) => {
      state.users.self = action.payload;
    },
    buyItem: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      const storeItem: Item = { ...state.store.find((i) => i.type === item)! };

      if (storeItem.type === 'segment') {
        storeItem.cost = storeItem.cost - state.levels.ship;
      }
      if (state.cash < storeItem.cost) throw new Error('Not enough cash for purchase.');

      state.inventory[storeItem.type]++;
      state.cash = c(state.cash - storeItem.cost);
    },
    resetSlice: () => {
      return initialState;
    },
    buyUpgrade: (state, action: PayloadAction<[UpgradeLevel, SettingsState]>) => {
      const [upgrade, settings] = action.payload;
      let upgrades: Upgrade[];
      let level: number;

      switch (upgrade) {
        case 'movement':
          upgrades = settings.upgrades.move;
          level = state.levels.movement;
          break;
        case 'pillage':
          upgrades = settings.upgrades.pillage;
          level = state.levels.pillage;
          break;
        case 'range':
          upgrades = settings.upgrades.range;
          level = state.levels.range;
          break;
        case 'ship':
          upgrades = settings.upgrades.ship;
          level = state.levels.ship;
          break;
        default:
          throw new Error(`${action.payload} not implemented`);
      }

      if (!upgrades[level + 1]) {
        throw new Error(`No next level for ${action.payload}`);
      }

      if (state.cash < upgrades[level + 1].cost) {
        throw new Error('You can not afford this upgrade.');
      }

      state.cash = c(state.cash - upgrades[level + 1].cost);
      state.levels[upgrade] += 1;
    },
    takeIncome: (state) => {
      const income = calculateIncome(state.ships);
      state.cash = c(state.cash + income);
    },
    addAction: (state, { payload: [_action, settings] }: PayloadAction<[BoardAction, SettingsState]>) => {
      const action = { ..._action };
      if (action.attacker === state.users.self.id) {
        action.pillage = state.levels.pillage;
        const pillage = settings.upgrades.pillage[state.levels.pillage];
        let bounty = 0;
        action.hits
          .filter((h) => h.userId !== state.users.self.id)
          .forEach((hit) => {
            bounty += pillage.earningsPerSegment;
          });
        state.cash = c(state.cash + bounty);
        const [weapon, range] = action.weapons;
        state.inventory[weapon] -= 1;
        if (range) {
          state.inventory[range] -= 1;
        }
      }
      state.actions.push(action);
    },
    removeAction: (state, { payload: [actionId, settings] }: PayloadAction<[number, SettingsState]>) => {
      const actionIndex = state.actions.findIndex((a) => a.id === actionId);
      const action = state.actions[actionIndex];
      if (!action) {
        return state;
      }

      if (action.attacker === state.users.self.id) {
        let bounty = 0;
        const pillage = settings.upgrades.pillage[action.pillage || 0];
        action.hits
          .filter((h) => h.userId !== state.users.self.id)
          .forEach(() => {
            bounty += pillage.earningsPerSegment;
          });
        state.cash = c(state.cash - bounty);
        const [weapon, range] = action.weapons;
        state.inventory[weapon] += 1;
        if (range) {
          state.inventory[range] += 1;
        }
      }

      state.actions.splice(actionIndex, 1);
    },
  },
});

export const { togglePlaceMode, toggleShipVisibility, skipTurn, addShip, selectShip, setTemporaryShip, saveTemporaryShip, buyItem, buyUpgrade, addUser, removeUser, editMe, resetSlice, takeIncome, addAction, removeAction } = gameSlice.actions;

export default gameSlice.reducer;
