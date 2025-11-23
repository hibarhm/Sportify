import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import favoritesReducer from './favoritesSlice';
import matchesReducer from './matchesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    matches: matchesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;