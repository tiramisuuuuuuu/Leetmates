import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import { chromeStorageAdapter } from "../api/chromeStorage";

const DARK_MODE_STORAGE_KEY = "leetmates-dark-mode";

// Earlier versions stored the setting as a raw "true"/"false" string.
const compatibleStorage: StateStorage = {
  getItem: async (name) => {
    const value = await chromeStorageAdapter.getItem(name);
    if (value === "true" || value === "false") {
      return JSON.stringify({
        state: { darkMode: value === "true" },
        version: 1,
      });
    }
    return value;
  },
  setItem: (name, value) => chromeStorageAdapter.setItem(name, value),
  removeItem: (name) => chromeStorageAdapter.removeItem(name),
};

interface DarkModeState {
  darkMode: boolean;
  hasHydrated: boolean;
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useDarkMode = create<DarkModeState>()(
  persist(
    (set) => ({
      darkMode: false,
      hasHydrated: false,
      setDarkMode: (darkMode) => set({ darkMode }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: DARK_MODE_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => compatibleStorage),
      partialize: (state) => ({ darkMode: state.darkMode }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
