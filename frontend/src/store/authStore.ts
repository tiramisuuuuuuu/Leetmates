import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../api/supabase";
import { AUTH_STORAGE_KEY, hasChromeStorage } from "../api/chromeStorage";

interface AuthState {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>()((set) => ({
  session: null,
  loading: true,
  setSession: (newSession: Session | null) =>
    set({ session: newSession, loading: false }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));

// Restores any persisted session, then keeps the store in sync with Supabase.
export function initAuth() {
  supabase.auth.getSession().then(({ data }) => {
    useAuth.getState().setSession(data.session);
  });

  const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
    useAuth.getState().setSession(newSession);
  });

  const onStorageChanged = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string,
  ) => {
    if (areaName !== "local" || !changes[AUTH_STORAGE_KEY]) return;

    const newValue = changes[AUTH_STORAGE_KEY].newValue as string | undefined;
    if (!newValue) {
      supabase.auth.signOut({ scope: "local" });
      return;
    }

    const stored = JSON.parse(newValue);
    supabase.auth.setSession({
      access_token: stored.access_token,
      refresh_token: stored.refresh_token,
    });
  };

  if (hasChromeStorage()) {
    chrome.storage.onChanged.addListener(onStorageChanged);
  }

  return () => {
    data.subscription.unsubscribe();
    if (hasChromeStorage()) {
      chrome.storage.onChanged.removeListener(onStorageChanged);
    }
  };
}
