/// <reference types="chrome" />
import { create } from "zustand";
import { hasChromeStorage } from "../api/chromeStorage";
import {
  EMPTY_PRESENCE,
  PRESENCE_STORAGE_KEY,
  type PresenceState,
} from "../types/presence";

// Read-only mirror of the presence state the background worker writes.
export const usePresence = create<PresenceState>()(() => EMPTY_PRESENCE);

export function initPresence() {
  if (!hasChromeStorage()) return () => {};

  chrome.storage.local.get(PRESENCE_STORAGE_KEY).then((result) => {
    const state = result[PRESENCE_STORAGE_KEY] as PresenceState | undefined;
    if (state) usePresence.setState(state);
  });

  const onChanged = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string,
  ) => {
    if (areaName !== "local" || !changes[PRESENCE_STORAGE_KEY]) return;
    const state = changes[PRESENCE_STORAGE_KEY].newValue as
      PresenceState | undefined;
    usePresence.setState(state ?? EMPTY_PRESENCE);
  };

  chrome.storage.onChanged.addListener(onChanged);
  return () => chrome.storage.onChanged.removeListener(onChanged);
}
