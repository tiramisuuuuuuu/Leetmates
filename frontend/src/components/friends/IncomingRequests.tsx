import { useQuery } from "@tanstack/react-query";
import { fetchFriendPreviewsSchema } from "../../types/friend";
import { fetchSignedUrl } from "../../api/supabase";
import { FaCheck } from "react-icons/fa6";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api/apiHelper";
import { useToast } from "../../store/toastStore";
import { genericResponseSchema } from "../../types/generic";

interface FriendPreview {
  id: string;
  username: string;
  profilePath: string | null;
}

function Friend({
  data,
  assetPrefix,
  handleAcceptRequest,
  handleDeleteRequest,
}: {
  data: FriendPreview;
  assetPrefix: string;
  handleAcceptRequest: (uid: string) => void;
  handleDeleteRequest: (uid: string) => void;
}) {
  const { data: signedUrl } = useQuery({
    queryKey: [data.id],
    queryFn: async () => {
      if (!data.profilePath) {
        return null;
      }
      return await fetchSignedUrl(data.profilePath);
    },
    staleTime: 55 * 1000,
  });

  return (
    <div className="flex flex-row items-center justify-between w-full py-1.5 px-1.5 border-1 border-ink/[0.06] rounded-lg">
      <div className="flex flex-row items-center gap-2 min-w-0 flex-1">
        <img
          src={signedUrl ? signedUrl : assetPrefix + "defaultProfile.svg"}
          alt={data.username}
          className="rounded-full w-9 h-9 bg-white object-cover"
          draggable={false}
        />

        <div className="font-semibold text-[14px] text-ink truncate  flex-1">
          {data.username}
        </div>
      </div>

      <div className="flex flex-row items-center gap-1 shrink-0">
        <button
          onClick={() => handleAcceptRequest(data.id)}
          className="inline-flex items-center gap-1.5 px-1.5 h-5.5 rounded-lg text-[11.5px] font-semibold text-cream border-1 border-clay bg-clay hover:bg-clay-dark hover:border-clay-dark transition-all focus:outline-none cursor-pointer"
        >
          <FaCheck size={10} />
          <span className="[@container(max-width:420px)]:hidden">Accept</span>
        </button>

        <button
          onClick={() => handleDeleteRequest(data?.id)}
          className="inline-flex items-center gap-1.5 px-1.5 h-5.5 rounded-lg text-[11.5px] font-semibold text-clay border-1 border-clay hover:bg-ink/5 transition-all focus:outline-none cursor-pointer"
        >
          <IoMdClose size={10} />
          <span className="[@container(max-width:420px)]:hidden">Reject</span>
        </button>
      </div>
    </div>
  );
}

export default function IncomingRequests() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [data, setData] = useState<FriendPreview[]>([]);
  const showToast = useToast((state) => state.showToast);

  useEffect(() => {
    async function fetchIncomingRequests() {
      try {
        const response = await apiFetch("/friends/incoming-requests");
        const body = await response.json();
        const parsed = fetchFriendPreviewsSchema.safeParse(body);

        if (!parsed.success) {
          console.log("Error ", parsed.error.issues);
          throw "Zod Error";
        }

        setData(parsed.data);
      } catch (err) {
        console.error("Failed to fetch incoming friend requests: ", err);
      }
    }

    fetchIncomingRequests();
  }, []);

  async function handleAcceptRequest(uid: string) {
    try {
      const response = await apiFetch("/friends/accept", {
        method: "POST",
        body: JSON.stringify({
          senderUid: uid,
        }),
      });
      const body = await response.json();
      const parsed = genericResponseSchema.safeParse(body);

      if (!parsed.success) {
        console.log("Error ", parsed.error.issues);
        throw "Zod Error";
      }

      setData((prev) => prev.filter((user) => user.id !== uid));
      showToast("success", "Friend added");
    } catch (err) {
      console.error("Failed to accept friend request: ", err);
      showToast("error", "Error accepting request");
    }
  }

  async function handleDeleteRequest(uid: string) {
    try {
      const response = await apiFetch("/friends/delete-request", {
        method: "POST",
        body: JSON.stringify({
          recipientUid: uid,
        }),
      });
      const body = await response.json();
      const parsed = genericResponseSchema.safeParse(body);

      if (!parsed.success) {
        console.log("Error ", parsed.error.issues);
        throw "Zod Error";
      }

      setData((prev) => prev.filter((user) => user.id !== uid));
      showToast("success", "Friend request removed");
    } catch (err) {
      console.error("Failed to delete friend request: ", err);
      showToast("error", "Error deleting request");
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center gap-1 pt-3">
      {data.map((user) => (
        <Friend
          key={user.id}
          data={user}
          assetPrefix={assetPrefix}
          handleAcceptRequest={handleAcceptRequest}
          handleDeleteRequest={handleDeleteRequest}
        />
      ))}
    </div>
  );
}
