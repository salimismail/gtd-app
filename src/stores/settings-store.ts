import { create } from 'zustand';
import { db } from '../db/database';

interface SettingsState {
  apiKey: string | null;
  theme: 'light' | 'dark' | 'system';
  isSettingsOpen: boolean;

  loadSettings: () => Promise<void>;
  setApiKey: (key: string) => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  openSettings: () => void;
  closeSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiKey: null,
  theme: 'light',
  isSettingsOpen: false,

  loadSettings: async () => {
    const settings = await db.settings.get(1);
    if (settings) {
      set({
        apiKey: settings.anthropicApiKey,
        theme: settings.theme,
      });
    }
  },

  setApiKey: async (key) => {
    await db.settings.update(1, { anthropicApiKey: key });
    set({ apiKey: key });
  },

  setTheme: async (theme) => {
    await db.settings.update(1, { theme });
    set({ theme });
  },

  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
}));
