import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import settingsReducer from '../reducers/settings/settingsSlice';
import gameReducer from '../reducers/game/gameSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    game: gameReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
