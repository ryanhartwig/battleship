import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Inventory, Item } from '../../types/items';
import { Ship } from '../../types/ship';
import { Upgrade } from '../../types/upgrades';
import { User } from '../../types/user';
import { c } from '../../utility/c';
import { items } from '../../utility/itemsData';
import { SettingsState } from '../settings/settingsSlice';

export type UpgradeLevel = 'movement' | 'pillage' | 'ship' | 'range';

interface GameState {
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
  levels: Record<UpgradeLevel, number>;
  /**
   * Records any items the player has purchased
   */
  inventory: Inventory;
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
  cash: 5000,
  ships: [],
  placeMode: false,
  levels: {
    movement: 0,
    pillage: 0,
    ship: 0,
    range: 0,
  },
  inventory: {
    segment: 10,
    ranged: 0,
    longranged: 0,
    bomb: 0,
    directional: 0,
    atomic: 0,
  },
  store: items,
  users: {
    self: {
      name: 'Me',
      initial: 'Me',
      id: Date.now().toString(),
    },
    opponents: [],
  },
};

const gameReducer = createSlice({
  name: 'game',
  initialState,
  reducers: {
    togglePlaceMode: (state) => {
      state.placeMode = !state.placeMode;
      delete state.temporaryShip;
      delete state.editingShip;
    },
    addShip: (state, action: PayloadAction<Ship>) => {
      state.ships.push(action.payload);
      delete state.editingShip;
    },
    selectShip: (state, action: PayloadAction<number>) => {
      state.editingShip = action.payload;
    },
    setTemporaryShip: (state, action: PayloadAction<Ship | undefined>) => {
      state.temporaryShip = action.payload;
    },
    saveTemporaryShip: (state, action: PayloadAction) => {
      if (!state.temporaryShip) {
        return;
      }
      state.inventory.segment -= state.temporaryShip.segments.length;
      state.ships.push(state.temporaryShip);
      state.temporaryShip = undefined;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.opponents.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
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
  },
});

export const { togglePlaceMode, addShip, selectShip, setTemporaryShip, saveTemporaryShip, buyItem, buyUpgrade, addUser, removeUser, editMe } = gameReducer.actions;

export default gameReducer.reducer;
