import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark' | 'system';
  showOnboarding: boolean;
  isOffline: boolean;
}

const initialState: UiState = {
  theme: 'system',
  showOnboarding: true,
  isOffline: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setShowOnboarding: (state, action: PayloadAction<boolean>) => {
      state.showOnboarding = action.payload;
    },
    setIsOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
  },
});

export const { setTheme, setShowOnboarding, setIsOffline } = uiSlice.actions;
export default uiSlice.reducer;
