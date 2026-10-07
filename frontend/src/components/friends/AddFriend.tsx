import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdContentCopy, MdPersonAdd } from "react-icons/md";
import Menu from "./Menu";
import {
  fetchFriendPreviewSchema,
  type FriendPreview,
} from "../../types/friend";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { FaClock } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { fetchSignedUrl } from "../../api/supabase";
import { apiFetch } from "../../api/apiHelper";
import { useProfile } from "../../store/profileStore";

function Friend({
  data,
  assetPrefix,
}: {
  data: FriendPreview;
  assetPrefix: string;
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

  const [tooltipHovered, setTooltipHovered] = useState(false);

  return (
    <div className="flex flex-row items-center gap-3 max-w-full">
      <div className="flex flex-row items-center gap-2 min-w-0 flex-1">
        <img
          src={signedUrl ? signedUrl : assetPrefix + "defaultProfile.svg"}
          alt={data.username}
          className="rounded-full w-8 h-8 bg-white object-cover"
        />

        <div className="font-semibold text-[13px] text-ink truncate  flex-1">
          {data.username}
        </div>
      </div>

      {data.friendStatus === "Incoming Request" && (
        <div
          className="relative [@container(max-width:400px)]:w-16 text-ink-muted text-[12px] text-center"
          onMouseEnter={() => setTooltipHovered(true)}
          onMouseLeave={() => setTooltipHovered(false)}
        >
          Check your inbox ⓘ
          {tooltipHovered && (
            <Menu position="top">
              <p className="min-w-18">
                This user has already sent you a friend request. You can accept
                it from your inbox.
              </p>
            </Menu>
          )}
        </div>
      )}

      {data.friendStatus === "Friends" && (
        <p className="text-ink-muted text-[12px] text-center">
          Already friends!
        </p>
      )}

      {data.friendStatus === "Requested" && (
        <button className="shrink-0 flex flex-row items-center gap-1 border border-clay-dark text-clay-dark cursor-pointer hover:bg-clay-dark hover:text-cream px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors">
          Pending
          <FaClock size={12} />
        </button>
      )}

      {data.friendStatus === null && (
        <button className="shrink-0 flex flex-row items-center gap-1 border border-clay text-clay cursor-pointer hover:bg-clay hover:text-cream px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors">
          <MdPersonAdd size={12} />
          Add
        </button>
      )}
    </div>
  );
}

export default function AddFriend() {
  const [friendCode, setFriendCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<FriendPreview | null>();
  const [errorCode, setErrorCode] = useState(0);
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const profile = useProfile((state) => state.profile);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile?.friendCode ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  async function handleSubmit() {
    try {
      if (friendCode === profile?.friendCode) {
        setErrorCode(2);
        return;
      }

      const response = await apiFetch(`/users/${friendCode}`);
      const body = await response.json();
      const parsed = fetchFriendPreviewSchema.safeParse(body);

      if (!parsed.success) {
        console.log("Error ", parsed.error.issues);
        throw "Zod Error";
      }

      setUser(parsed.data);
      setErrorCode(0);
    } catch (err) {
      console.error("Failed to add friend via code: ", err);
      setErrorCode(1);
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between items-center">
      <p className="text-xs text-ink-muted">Find friend using their code</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full flex flex-col justify-center items-center"
      >
        <div
          className={`flex flex-row items-center bg-cream-muted border ${errorCode ? "border-red-500" : "border-ink/30"} rounded-md w-full max-w-60 h-7 overflow-hidden`}
        >
          <input
            type="text"
            placeholder="Search user code"
            value={friendCode}
            onChange={(e) => {
              setFriendCode(e.target.value);
              setErrorCode(0);
            }}
            className="flex-1 min-w-0 h-full pl-2.5 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none"
          />

          <button
            className="bg-clay text-cream w-7 h-full flex justify-center items-center"
            type="submit"
          >
            <IoSearch size={12} />
          </button>
        </div>
        {errorCode !== 0 && (
          <p className="text-red-500 text-[12px]">
            {errorCode === 1 ? "User not found." : "Cannot friend yourself."}
          </p>
        )}
      </form>

      {user && <Friend assetPrefix={assetPrefix} data={user} />}

      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-px bg-ink/15" />
        <div className="flex flex-row justify-center items-center gap-2">
          <p className="text-ink-muted text-[12px]">Your code:</p>
          <button
            className="relative p-1 px-2 border-1 border-ink/40 hover:bg-ink/10 rounded-[8px] flex flex-row justify-center items-center gap-1 text-ink-muted"
            onClick={() => profile?.friendCode && handleCopy()}
          >
            <p className="text-ink font-bold ">
              {profile?.friendCode ?? "Error: Contact admin"}
            </p>
            {profile?.friendCode && <MdContentCopy />}
            {copied && (
              <Menu position="top">
                <p className="font-bold">Copied!</p>
              </Menu>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
