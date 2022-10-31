import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Upgrades } from "../../types/upgrades";
import { upgradesInitialState } from "../../utility/upgradesData";

interface SettingsState {
  size: number;
  startPieces: number;
  maxShipLength: number;
  upgrades: Upgrades
}

const initialState: SettingsState = {
  size: 10,
  startPieces: 10,
  maxShipLength: 8,
  upgrades: upgradesInitialState,
}

const settingsReducer = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setStartPieces: (state, action: PayloadAction<number>) => {
      state.startPieces = action.payload;
    },
  }
});

export const selectSettings = (state: RootState) => state.settings;

export const { setStartPieces } = settingsReducer.actions;

export default settingsReducer.reducer;
