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
}



const initialState: GameState = {
  cash: 0,
  segments: 0,
  ships: []
}

const gameReducer = createSlice({
  name: 'game',
  initialState,
  reducers: {},
});

export default gameReducer.reducer
