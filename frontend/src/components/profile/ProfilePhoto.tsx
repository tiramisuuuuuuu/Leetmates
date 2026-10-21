import { useQuery } from "@tanstack/react-query";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { fetchOwnProfileUrl } from "../../api/supabase";

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
