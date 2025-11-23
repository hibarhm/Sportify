import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Favorite {
  id: string;
  name: string;
}

interface FavoritesState {
  items: Favorite[];
}

const initialState: FavoritesState = { items: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      state.items.push(action.payload);
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;