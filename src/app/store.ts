import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../counter-features/counter/counterSlice';
import settingsReducer from '../store-state/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
