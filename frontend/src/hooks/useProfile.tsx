import { useEffect } from "react";
import { useProfile } from "../store/profileStore";
import { apiFetch } from "../api/apiHelper";
import { fetchProfileSchema } from "../types/profile";
import { useProfileForm } from "../store/profileFormStore";

export function useUserProfile() {
  const profile = useProfile((state) => state.profile);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiFetch("/users");
        const body = await response.json();
        const parsed = fetchProfileSchema.safeParse(body);

        if (!parsed.success) {
          console.log("Error ", parsed.error.issues);
          throw "Zod Error";
        }

        useProfile.getState().setProfile(parsed.data);
      } catch (err) {
        console.error("Failed to fetch profile: ", err);
      }
    }

    if (!profile) {
      fetchProfile();
    } else {
      useProfileForm.getState().initForm(profile);
    }
  }, [profile]);

  return profile;
}
