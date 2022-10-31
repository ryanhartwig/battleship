import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Ship } from '../../types/ship'

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
  ships: Ship[]
  /**
   * Whether or not clicking squares means you are placing
   * down new segments or not.
   */
  placeMode: boolean
}



const initialState: GameState = {
  cash: 0,
  segments: 10,
  ships: [
    { id: 38813, segments: [{ x: 3, y: 3, originalCost: 10 }, { x: 4, y: 3, originalCost: 10 }, { x: 5, y: 3, originalCost: 10 }] },
    { id: 91949, segments: [{ x: 1, y: 4, originalCost: 10 }, { x: 1, y: 5, originalCost: 10 }, { x: 1, y: 6, originalCost: 10 }] }
  ],
  placeMode: false
}

const gameReducer = createSlice({
  name: 'game',
  initialState,
  reducers: {
    togglePlaceMode: (state) => {
      state.placeMode = !state.placeMode;
    },
    addShip: (state, action: PayloadAction<Ship>) => {
      state.ships.push(action.payload);
    }
  },
});

export const { togglePlaceMode } = gameReducer.actions;

export default gameReducer.reducer
