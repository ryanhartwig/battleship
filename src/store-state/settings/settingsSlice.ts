import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface SettingsState {
  size: number;
  startPieces: number;
}

const initialState: SettingsState = {
  size: 10,
  startPieces: 10,
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
