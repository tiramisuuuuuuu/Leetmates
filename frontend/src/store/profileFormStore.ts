import { create } from "zustand";

interface ProfileFormState {
  file: File | null;
  previewUrl: string | null;
  updatePhoto: (file: File | null, previewUrl: string | null) => void;
}

export const useProfileForm = create<ProfileFormState>()((set) => ({
  file: null,
  previewUrl: null,
  updatePhoto: (file: File | null, previewUrl: string | null) =>
    set({ file, previewUrl }),
}));
