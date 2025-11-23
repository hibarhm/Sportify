import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Match {
  id: string;
  home: string;
  away: string;
  date: string;
}

interface MatchesState {
  items: Match[];
}

const initialState: MatchesState = { items: [] };

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setMatches } = matchesSlice.actions;
export default matchesSlice.reducer;