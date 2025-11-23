import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: { name: string } | null;
}

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string }>) => {
      state.user = action.payload;
      AsyncStorage.setItem('auth', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      AsyncStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;