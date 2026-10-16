import { create } from "zustand";

interface ProfileFormState {
  file: File | null;
  previewUrl: string | null;
  countryCode: string | null;
  currentStatus: string | null;
  matchingPreference: string;
  showModal: boolean;
  showNotificationsModal: boolean;
  updatePhoto: (file: File | null, previewUrl: string | null) => void;
  setCountryCode: (countryCode: string | null) => void;
  setCurrentStatus: (currentStatus: string | null) => void;
  setMatchingPreference: (matchingPreference: string) => void;
  setShowModal: (showModal: boolean) => void;
  setShowNotificationsModal: (showModal: boolean) => void;
}

export const useProfileForm = create<ProfileFormState>()((set) => ({
  file: null,
  previewUrl: null,
  countryCode: null,
  currentStatus: null,
  matchingPreference: "everyone",
  showModal: false,
  showNotificationsModal: false,
  updatePhoto: (file: File | null, previewUrl: string | null) =>
    set({ file, previewUrl }),
  setCountryCode: (countryCode: string | null) => set({ countryCode }),
  setCurrentStatus: (currentStatus: string | null) => set({ currentStatus }),
  setMatchingPreference: (matchingPreference: string) =>
    set({ matchingPreference }),
  setShowModal: (showModal: boolean) => set({ showModal }),
  setShowNotificationsModal: (showNotificationsModal: boolean) =>
    set({ showNotificationsModal }),
}));
