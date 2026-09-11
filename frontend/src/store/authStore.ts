import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../api/supabase";

interface AuthState {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
}

export const useAuth = create<AuthState>()((set) => ({
  session: null,
  loading: true,
  setSession: (newSession: Session | null) =>
    set({ session: newSession, loading: false }),
}));

// Restores any persisted session, then keeps the store in sync with Supabase.
export function initAuth() {
  supabase.auth.getSession().then(({ data }) => {
    useAuth.getState().setSession(data.session);
  });

  const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
    useAuth.getState().setSession(newSession);
  });

  return () => data.subscription.unsubscribe();
}
