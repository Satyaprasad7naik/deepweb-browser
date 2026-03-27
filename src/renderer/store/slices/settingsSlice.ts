import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'dark' | 'light';
  searchEngine: string;
  httpsOnly: boolean;
  blockTracking: boolean;
  blockFingerprinting: boolean;
  dnsOverHttps: boolean;
  clearCacheOnExit: boolean;
  clearCookiesOnExit: boolean;
  saveHistory: boolean;
}

const initialState: SettingsState = {
  theme: 'dark',
  searchEngine: 'duckduckgo',
  httpsOnly: true,
  blockTracking: true,
  blockFingerprinting: true,
  dnsOverHttps: true,
  clearCacheOnExit: false,
  clearCookiesOnExit: false,
  saveHistory: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload;
    },
    setSearchEngine(state, action: PayloadAction<string>) {
      state.searchEngine = action.payload;
    },
    toggleSetting(state, action: PayloadAction<keyof Omit<SettingsState, 'theme' | 'searchEngine'>>) {
      const key = action.payload;
      (state[key] as boolean) = !state[key];
    },
    updateSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setTheme, setSearchEngine, toggleSetting, updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
