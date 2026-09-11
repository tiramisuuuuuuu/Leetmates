import { createClient } from "@supabase/supabase-js";
import { chromeStorageAdapter, AUTH_STORAGE_KEY } from "./chromeStorage";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: chromeStorageAdapter,
    storageKey: AUTH_STORAGE_KEY,
    persistSession: true,
    autoRefreshToken: true,
    // Neither the popup nor the content script is an OAuth redirect target.
    detectSessionInUrl: false,
  },
});

export async function signUpNewUser(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function signInUser(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    throw new Error(error.message);
  }
}
