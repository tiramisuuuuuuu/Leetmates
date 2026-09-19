import { create } from "zustand";

interface ProfileFormState {
  file: File | null;
  previewUrl: string | null;
  countryCode: string | null;
  currentStatus: string | null;
  matching: string;
  updatePhoto: (file: File | null, previewUrl: string | null) => void;
  setCountryCode: (countryCode: string | null) => void;
  setCurrentStatus: (currentStatus: string | null) => void;
  setMatching: (matching: string) => void;
}

export const useProfileForm = create<ProfileFormState>()((set) => ({
  file: null,
  previewUrl: null,
  countryCode: null,
  currentStatus: null,
  matching: "everyone",
  updatePhoto: (file: File | null, previewUrl: string | null) =>
    set({ file, previewUrl }),
  setCountryCode: (countryCode: string | null) => set({ countryCode }),
  setCurrentStatus: (currentStatus: string | null) => set({ currentStatus }),
  setMatching: (matching: string) => set({ matching }),
}));
