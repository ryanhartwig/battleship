import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Upgrades } from '../../types/upgrades';
import { upgradesInitialState } from '../../utility/upgradesData';

export interface SettingsState {
  version: number;
  initialized: boolean;
  size: number;
  startPieces: number;
  maxShipLength: number;
  minimumIncome: number;
  upgrades: Upgrades;
}

export const settingsInitialState: SettingsState = {
  version: 6,
  initialized: false,
  size: 10,
  startPieces: 10,
  maxShipLength: 8,
  minimumIncome: 10,
  upgrades: upgradesInitialState,
};

let savedState: SettingsState | undefined;
try {
  savedState = JSON.parse(localStorage.getItem('settings') as string) as SettingsState;
  if (savedState.version !== settingsInitialState.version) {
    savedState = undefined;
  }
} catch (e) {
  // no game/data saved
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: savedState || settingsInitialState,
  reducers: {
    initializeSettings: (state, action: PayloadAction<SettingsState>) => {
      return action.payload;
    },
    setStartPieces: (state, action: PayloadAction<number>) => {
      state.startPieces = action.payload;
    },
    resetSettings: () => {
      return settingsInitialState;
    },
  },
});

export const selectSettings = (state: RootState) => state.settings;

export const { initializeSettings, setStartPieces, resetSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
