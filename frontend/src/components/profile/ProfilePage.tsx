import { CiInboxIn } from "react-icons/ci";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { IoIosAdd, IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { TiPencil } from "react-icons/ti";
import { useProfile } from "../../store/profileStore";
import { apiFetch } from "../../api/apiHelper";
import { fetchProfileSchema } from "../../types/profile";
import UserDetails from "./UserDetails";
import { useQuery } from "@tanstack/react-query";
import { fetchOwnProfileUrl } from "../../api/supabase";

function ProfilePhoto({ profilePath }: { profilePath: string | null }) {
  const { data: profileUrl } = useQuery({
    queryKey: ["user_profile_photo"],
    queryFn: async () => {
      if (!profilePath) {
        return null;
      }
      return await fetchOwnProfileUrl(profilePath);
    },
    staleTime: Infinity,
  });

  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);

  return (
    <img
      src={profileUrl ? profileUrl : assetPrefix + "defaultProfile.svg"}
      alt="Profile photo"
      className={`rounded-full w-16 h-16 bg-white object-cover flex justify-center items-center`}
      draggable={false}
    />
  );
}

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
    }
  }, [profile]);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-cream/90 flex flex-col text-xs text-start overflow-hidden">
      {/* menu board header */}
      <div className="relative flex flex-row justify-between items-center py-2 px-3">
        <button
          onClick={() => closeModal()}
          className="flex flex-row items-center gap-1 text-ink-muted hover:text-ink text-xs font-semibold cursor-pointer rounded-full  transition-colors"
        >
          <IoIosArrowBack size={14} />
          Lobby
        </button>

        <button
          className="relative rounded-full bg-cream border-1 border-1 border-clay text-clay hover:bg-clay hover:text-cream shadow-sm w-6 h-6 cursor-pointer transition-colors flex justify-center items-center"
          onClick={() => {}}
        >
          <TiPencil size={15} />
        </button>

        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-ink">
          Profile
        </p>
      </div>

      <div className="relative flex-1 flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-col px-3 pb-2 divide-y divide-ink/[0.06]">
          <div className="w-full flex justify-center items-center">
            <ProfilePhoto
              profilePath={profile?.profilePath ? profile?.profilePath : null}
            />
          </div>

          <div>
            <MenuHeading label="User Details" />
            <div className="flex flex-col">
              <UserDetails />
            </div>
          </div>

          <div>
            <MenuHeading label="Matching Data" />
            <div className="flex flex-col"></div>
          </div>
        </div>

        {/* <img
          src={assetPrefix + "autumn.svg"}
          id="bg-image"
          alt="cozy autumn background"
          className="w-full select-none opacity-90 -mt-1"
          draggable={false}
        /> */}
      </div>
    </div>
  );
}
