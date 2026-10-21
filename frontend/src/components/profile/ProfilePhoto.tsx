import { useQuery } from "@tanstack/react-query";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { fetchOwnProfileUrl } from "../../api/supabase";
import { FaTrashCan } from "react-icons/fa6";
import { BiSolidPencil } from "react-icons/bi";
import { useRef, useState } from "react";
import { useProfileForm } from "../../store/profileFormStore";

export function UploadPhoto({ profilePath }: { profilePath: string | null }) {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const updatePhoto = useProfileForm((state) => state.updatePhoto);
  const file = useProfileForm((state) => state.file);
  const previewUrl = useProfileForm((state) => state.previewUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoChanged, setPhotoChanged] = useState(false);

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const localUrl = URL.createObjectURL(selectedFile);
      updatePhoto(selectedFile, localUrl);
      setPhotoChanged(true);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <div className="relative">
        <img
          src={
            !photoChanged && profileUrl
              ? profileUrl
              : previewUrl
                ? previewUrl
                : assetPrefix + "defaultProfile.svg"
          }
          id="profile-image"
          alt="default profile picture"
          className="w-16 h-16 object-cover select-none rounded-full overflow-hidden"
          draggable={false}
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          className={`absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[#0000001c] ${!file && "hover:bg-[#00000037]"} rounded-full overflow-hidden gap-1`}
          onClick={() => {
            !(file || (!photoChanged && profileUrl)) &&
              inputRef.current?.click();
          }}
        >
          <button
            onClick={() => {
              file && inputRef.current?.click();
            }}
          >
            <BiSolidPencil size={16} color="white" />
          </button>

          {(file || (!photoChanged && profileUrl)) && (
            <button
              onClick={() => {
                updatePhoto(null, null);
                setPhotoChanged(true);
              }}
            >
              <FaTrashCan size={12} color="white" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-ink-muted">Upload a profile photo</p>
    </div>
  );
}

export default function ProfilePhoto({
  profilePath,
}: {
  profilePath: string | null;
}) {
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
