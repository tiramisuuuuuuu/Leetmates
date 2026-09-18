import { create } from "zustand";

interface ProfileFormState {
  file: File | null;
  previewUrl: string | null;
  countryCode: string | null;
  updatePhoto: (file: File | null, previewUrl: string | null) => void;
  setCountryCode: (countryCode: string | null) => void;
}

export const useProfileForm = create<ProfileFormState>()((set) => ({
  file: null,
  previewUrl: null,
  countryCode: null,
  updatePhoto: (file: File | null, previewUrl: string | null) =>
    set({ file, previewUrl }),
  setCountryCode: (countryCode: string | null) => set({ countryCode }),
}));
