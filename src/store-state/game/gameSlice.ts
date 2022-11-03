import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ship } from '../../types/ship';
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
  levels: {
    movement: number;
    pillage: number;
    ship: number;
    range: number;
  };
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
  },
});

export const { togglePlaceMode, addShip, selectShip, setTemporaryShip, saveTemporaryShip } = gameReducer.actions;

export default gameReducer.reducer;
