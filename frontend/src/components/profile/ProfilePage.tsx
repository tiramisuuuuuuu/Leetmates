import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { TiPencil } from "react-icons/ti";
import { useProfile } from "../../store/profileStore";
import { apiFetch } from "../../api/apiHelper";
import { fetchProfileSchema } from "../../types/profile";
import ProfilePhoto, { UploadPhoto } from "./ProfilePhoto";
import { AccountDetailsForm, MatchingDataForm } from "./Sections";
import { useProfileForm } from "../../store/profileFormStore";
import { deleteFile, uploadFile } from "../../api/supabase";
import { useToast } from "../../store/toastStore";
import { useQueryClient } from "@tanstack/react-query";

function MenuHeading({ label }: { label: string }) {
  return (
    <div className="flex flex-row items-center gap-2 px-1 pt-3 pb-1">
      <span className="text-[13px] text-clay-dark">{label}</span>
      {/* <span className="text-[11px] text-ink/40">({count})</span> */}
      <div className="flex-1 h-px bg-ink/15" />
    </div>
  );
}

export default function ProfilePage({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const profile = useProfile((state) => state.profile);
  const [editing, setEditing] = useState(false);
  const showToast = useToast((state) => state.showToast);
  const queryClient = useQueryClient();

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
        useProfileForm.getState().initForm(parsed.data);
      } catch (err) {
        console.error("Failed to fetch profile: ", err);
      }
    }

    if (!profile) {
      fetchProfile();
    }
  }, [profile]);

  async function handleSubmit() {
    try {
      const file = useProfileForm.getState().file;
      const photoChanged = useProfileForm.getState().photoChanged;
      const prevPhoto = profile?.profilePath;
      const countryCode = useProfileForm.getState().countryCode;
      const currentStatus = useProfileForm.getState().currentStatus;
      const matchingPreference = useProfileForm.getState().matchingPreference;

      let requestBody = {
        countryCode,
        currentStatus,
        matchingPreference,
      };

      let profilePath = null;
      if (file) {
        profilePath = await uploadFile(file);
      }

      if (photoChanged) {
        requestBody["profilePath"] = profilePath;
        if (profilePath == null && prevPhoto) {
          deleteFile(prevPhoto);
        }
      }

      const response = await apiFetch("/users/update", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const body = await response.json();
      const parsed = fetchProfileSchema.safeParse(body);

      if (!parsed.success) {
        console.log("Error ", parsed.error.issues);
        throw { message: "Backend error" };
      }

      useProfile.getState().setProfile(parsed.data);
      useProfileForm.getState().initForm(parsed.data);

      if (photoChanged) {
        await queryClient.invalidateQueries({
          queryKey: ["user_profile_photo"],
        });
      }

      showToast("success", "Profile updated");
      setEditing(false);
    } catch (error: any) {
      showToast("error", error.message);
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-cream/90 flex flex-col text-xs text-start overflow-hidden">
      {/* menu board header */}
      <div className="relative flex flex-row justify-between items-center py-2 px-3">
        <button
          onClick={() => (!editing ? closeModal() : setEditing(false))}
          className="h-6 flex flex-row items-center gap-1 text-ink-muted hover:text-ink text-xs font-semibold cursor-pointer rounded-full  transition-colors"
        >
          <IoIosArrowBack size={14} />
          {!editing ? "Lobby" : "Cancel"}
        </button>

        {!editing && (
          <button
            className="relative rounded-full bg-cream border-1 border-1 border-clay text-clay hover:bg-clay hover:text-cream shadow-sm w-6 h-6 cursor-pointer transition-colors flex justify-center items-center"
            onClick={() => setEditing(true)}
          >
            <TiPencil size={15} />
          </button>
        )}

        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-ink">
          {!editing ? "Profile" : "Editing Profile"}
        </p>
      </div>

      <div className="relative flex-1 flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        {profile && (
          <div className="flex flex-col px-3 pb-5 gap-1.5">
            <div className="ml-1.5 flex flex-col justify-center items-center gap-1">
              {!editing ? (
                <ProfilePhoto profilePath={profile.profilePath} />
              ) : (
                <UploadPhoto profilePath={profile.profilePath} />
              )}
            </div>

            <MenuHeading label="Account Details" />
            <div className="w-full flex flex-col justify-center py-1.5 px-1.5 border-1 border-ink/[0.06] rounded-lg">
              <AccountDetailsForm profile={profile} editing={editing} />
            </div>

            <MenuHeading label="Matching Data" />
            <div className="w-full flex flex-col justify-center py-1.5 px-1.5 border-1 border-ink/[0.06] rounded-lg">
              <MatchingDataForm editing={editing} />
            </div>

            {editing && (
              <div className="mt-7 flex items-center justify-center">
                <button
                  className="w-full max-w-3xs gap-1.5 bg-clay hover:bg-clay-dark text-white text-xs font-semibold rounded-md py-2 cursor-pointer"
                  onClick={() => handleSubmit()}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
