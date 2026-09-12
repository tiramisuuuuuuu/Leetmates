/// <reference types="chrome" />

export const chromeStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (hasChromeStorage()) {
      const result = await chrome.storage.local.get(key);
      return (result[key] as string | undefined) ?? null;
    }

    return localStorage.getItem(key);
  },

  setItem: async (key: string, value: string) => {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [key]: value });
      return;
    }

    localStorage.setItem(key, value);
  },

  removeItem: async (key: string) => {
    if (hasChromeStorage()) {
      await chrome.storage.local.remove(key);
      return;
    }

    localStorage.removeItem(key);
  },
};

export const AUTH_STORAGE_KEY = "leetmates-auth";

export const hasChromeStorage = () =>
  typeof chrome !== "undefined" && !!chrome.storage?.local;
