import { configureStore, ThunkAction, Action, createListenerMiddleware } from '@reduxjs/toolkit';
import settingsReducer from '../reducers/settings/settingsSlice';
import gameReducer from '../reducers/game/gameSlice';
import { gameSlice } from '../reducers/game/gameSlice';
import { settingsSlice } from '../reducers/settings/settingsSlice';

const listener = createListenerMiddleware();

listener.startListening({
  predicate(action) {
    return action.type.startsWith(gameSlice.name);
  },
  effect: (_, api) => {
    localStorage.setItem('game', JSON.stringify((api.getState() as any)[gameSlice.name]));
  },
});

listener.startListening({
  predicate(action) {
    return action.type.startsWith(settingsSlice.name);
  },
  effect: (_, api) => {
    localStorage.setItem('settings', JSON.stringify((api.getState() as any)[settingsSlice.name]));
  },
});

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    game: gameReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().prepend(listener.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
