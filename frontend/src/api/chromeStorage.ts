/// <reference types="chrome" />

export const chromeStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    const result = await chrome.storage.local.get(key);
    // Supabase expects null for a missing key, not undefined.
    return (result[key] as string | undefined) ?? null;
  },
  setItem: async (key: string, value: string) => {
    await chrome.storage.local.set({ [key]: value });
  },
  removeItem: async (key: string) => {
    await chrome.storage.local.remove(key);
  }
};

export const AUTH_STORAGE_KEY = 'leetmates-auth';

export const hasChromeStorage = () => typeof chrome !== 'undefined' && chrome.storage !== undefined;
