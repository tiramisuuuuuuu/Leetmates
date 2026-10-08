import { useQuery } from "@tanstack/react-query";
import type { FriendPreview } from "../../types/friend";
import { fetchSignedUrl } from "../../api/supabase";
import { FaCheck } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { IoMdClose } from "react-icons/io";

function Friend({
  data,
  assetPrefix,
  handleSendRequest,
  handleDeleteRequest,
}: {
  data: FriendPreview;
  assetPrefix: string;
  handleSendRequest: (uid: string) => void;
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
          onClick={() => handleSendRequest(data.id)}
          className="inline-flex items-center gap-1.5 px-1.5 h-5.5 rounded-lg text-[11.5px] font-semibold text-cream border-1 border-clay bg-clay hover:bg-clay-dark hover:border-clay-dark transition-all focus:outline-none cursor-pointer"
        >
          <FaCheck size={10} />
          <span className="[@container(max-width:420px)]:hidden">Accept</span>
        </button>

        <button
          onClick={() => handleDeleteRequest(data.id)}
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

  const friends: FriendPreview[] = [
    {
      id: "1",
      username: "mochi",
      profilePath: null,
      friendStatus: "Incoming request",
    },
    {
      id: "2",
      username: "Blade",
      friendStatus: "Incoming request",
      profilePath: null,
    },
    // {
    //   id: "3",
    //   username: "Bob A.",
    //   friendStatus: "Incoming request",
    //   profilePath: null,
    // },
  ];

  return (
    <div className="flex-1 flex flex-col items-center gap-1 pt-3">
      {friends.map((friend) => (
        <Friend
          data={friend}
          assetPrefix={assetPrefix}
          handleSendRequest={(uid: string) => {
            console.log(uid);
          }}
          handleDeleteRequest={(uid: string) => {
            console.log(uid);
          }}
        />
      ))}
    </div>
  );
}
