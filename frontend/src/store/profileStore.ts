import { create } from "zustand";
import type { Profile } from "../types/profile";
import { createJSONStorage, persist } from "zustand/middleware";
import { chromeStorageAdapter } from "../api/chromeStorage";

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile: Profile) =>
        set({
          profile,
        }),
      clearProfile: () =>
        set({
          profile: null,
        }),
    }),
    {
      name: "leetmates-profile",
      storage: createJSONStorage(() => chromeStorageAdapter),
    },
  ),
);
