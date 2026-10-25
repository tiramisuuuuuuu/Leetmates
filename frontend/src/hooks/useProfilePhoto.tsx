import { useQuery } from "@tanstack/react-query";
import { fetchOwnProfileBlob } from "../api/supabase";
import { useEffect, useState } from "react";

export default function useProfilePhoto(profilePath?: string | null) {
  const { data: blob } = useQuery({
    queryKey: ["user_profile_photo", profilePath],
    queryFn: async () => {
      if (!profilePath) {
        return null;
      }

      try {
        const blob = await fetchOwnProfileBlob(profilePath);
        return blob;
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
  });

  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      setProfileUrl(null);
      return;
    }

    const imageUrl = URL.createObjectURL(blob);
    setProfileUrl(imageUrl); // create a blob url pointing to the blob

    return () => {
      // if target blob changes or component unmounts, cleanup old blob url
      URL.revokeObjectURL(imageUrl);
    };
  }, [blob]);

  return profileUrl;
}
