import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Inventory, Item } from '../../types/items';
import { Ship } from '../../types/ship';
import { Upgrade } from '../../types/upgrades';
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
   * Stores the number of placeable segments
   */
  segments: number;
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
}

const initialState: GameState = {
  cash: 5000,
  segments: 10,
  ships: [],
  placeMode: false,
  levels: {
    movement: 0,
    pillage: 0,
    ship: 0,
    range: 0,
  },
  inventory: {
    segments: 0,
    rangedMissiles: 0,
    longRangedMissiles: 0,
    bombs: 0,
    directionalBombs: 0,
    atomicBombs: 0,
  },
  store: items,
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
      state.segments -= state.temporaryShip.segments.length;
      state.ships.push(state.temporaryShip);
      state.temporaryShip = undefined;
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

export const { togglePlaceMode, addShip, selectShip, setTemporaryShip, saveTemporaryShip, buyUpgrade } = gameReducer.actions;

export default gameReducer.reducer;
