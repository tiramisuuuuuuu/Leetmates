import { create } from "zustand";
import type { Profile } from "../types/profile";

interface ProfileFormState {
  file: File | null;
  previewUrl: string | null;
  countryCode: string | null;
  currentStatus: string | null;
  matchingPreference: string;
  showModal: boolean;
  showNotificationsModal: boolean;
  photoChanged: boolean;
  displayName: string | null;
  updatePhoto: (file: File | null, previewUrl: string | null) => void;
  setCountryCode: (countryCode: string | null) => void;
  setCurrentStatus: (currentStatus: string | null) => void;
  setMatchingPreference: (matchingPreference: string) => void;
  setShowModal: (showModal: boolean) => void;
  setShowNotificationsModal: (showModal: boolean) => void;
  setDisplayName: (displayName: string) => void;
  clearForm: () => void;
  initForm: (profile: Profile) => void;
}

export const useProfileForm = create<ProfileFormState>()((set) => ({
  file: null,
  previewUrl: null,
  countryCode: null,
  currentStatus: null,
  matchingPreference: "everyone",
  showModal: false,
  showNotificationsModal: false,
  photoChanged: false,
  displayName: null,
  updatePhoto: (file: File | null, previewUrl: string | null) =>
    set({ file, previewUrl, photoChanged: true }),
  setCountryCode: (countryCode: string | null) => set({ countryCode }),
  setCurrentStatus: (currentStatus: string | null) => set({ currentStatus }),
  setMatchingPreference: (matchingPreference: string) =>
    set({ matchingPreference }),
  setShowModal: (showModal: boolean) => set({ showModal }),
  setShowNotificationsModal: (showNotificationsModal: boolean) =>
    set({ showNotificationsModal }),
  setDisplayName: (displayName: string) => set({ displayName }),
  clearForm: () =>
    set({
      file: null,
      previewUrl: null,
      countryCode: null,
      currentStatus: null,
      matchingPreference: "everyone",
      photoChanged: false,
      displayName: null,
    }),
  initForm: (profile: Profile) =>
    set({
      file: null,
      previewUrl: null,
      countryCode: profile.countryCode,
      currentStatus: profile.currentStatus,
      matchingPreference: profile.matchingPreference,
      photoChanged: false,
      displayName: profile.username,
    }),
}));
