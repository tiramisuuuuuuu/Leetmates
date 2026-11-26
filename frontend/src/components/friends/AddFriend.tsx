import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdContentCopy, MdPersonAdd } from "react-icons/md";
import Menu from "../ui/Menu";
import {
  fetchFriendPreviewSchema,
  type FriendPreview,
} from "../../types/friend";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { FaClock } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { fetchSignedUrl } from "../../api/supabase";
import { apiFetch } from "../../api/apiHelper";
import { useToast } from "../../store/toastStore";
import { genericResponseSchema } from "../../types/generic";
import { useUserProfile } from "../../hooks/useProfile";

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
      if (!data.profilePath) return null;
      return await fetchSignedUrl(data.profilePath);
    },
    staleTime: 55 * 1000,
  });

  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-ink/10 bg-cream-accent px-3 py-2.5">
      {/* Friend information */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <img
          src={signedUrl ?? assetPrefix + "defaultProfile.svg"}
          alt={data.username}
          className="h-9 w-9 shrink-0 rounded-full border border-cream bg-white object-cover"
          draggable={false}
        />

        <span className="min-w-0 truncate text-xs font-semibold text-ink">
          {data.username}
        </span>
      </div>

      {/* Friend action */}
      {data.friendStatus === "Friends" && (
        <span className="shrink-0 rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-semibold text-ink-muted">
          Friends
        </span>
      )}

      {data.friendStatus === "Requested" && (
        <button
          onClick={() => handleDeleteRequest(data.id)}
          className="flex h-8 min-w-[76px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-clay/30 bg-clay/10 px-2.5 text-[10px] font-semibold text-clay transition-colors hover:border-clay hover:bg-clay hover:text-cream"
        >
          Pending
          <FaClock size={11} />
        </button>
      )}

      {(data.friendStatus === null ||
        data.friendStatus === "Incoming request") && (
        <button
          onClick={() => handleSendRequest(data.id)}
          className="flex h-8 min-w-[76px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-clay px-2.5 text-[10px] font-semibold text-clay transition-colors hover:bg-clay hover:text-cream"
        >
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
  const profile = useUserProfile();
  const showToast = useToast((state) => state.showToast);

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

  async function handleSendRequest(uid: string) {
    try {
      const response = await apiFetch("/friends/request", {
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

      setUser((user) =>
        user?.id === uid
          ? { ...user, friendStatus: parsed.data.message }
          : user,
      );
      showToast(
        "success",
        parsed.data.message === "Requested"
          ? "Friend request sent"
          : "Friend added",
      );
    } catch (err) {
      console.error("Failed to send friend request: ", err);
      showToast("error", "Error sending request");
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

      setUser((user) =>
        user?.id === uid ? { ...user, friendStatus: null } : user,
      );
      showToast("success", "Friend request revoked");
    } catch (err) {
      console.error("Failed to delete friend request: ", err);
      showToast("error", "Error deleting request");
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-between gap-2 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/20">
      <div className="w-full flex flex-col items-center gap-2 ">
        <div className="text-center">
          {/* <p className="text-[12px] font-semibold text-ink">Find a friend</p> */}
          <p className="text-[12px] text-ink-muted">Find friend using their</p>
          <p className="text-[12px] text-ink-muted">friend code</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="w-full flex flex-col items-center gap-1"
        >
          <div
            className={`flex h-8 w-full items-center overflow-hidden rounded-md border bg-cream-muted ${errorCode ? "border-red-500" : "border-ink/20 focus-within:border-clay"}`}
          >
            <input
              type="text"
              placeholder="Enter friend code"
              value={friendCode}
              onChange={(e) => {
                setFriendCode(e.target.value);
                setErrorCode(0);
              }}
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[11px] text-ink placeholder:text-ink-muted outline-none"
            />

            <button
              aria-label="Search friend code"
              className="flex h-full w-9 shrink-0 items-center justify-center rounded-r bg-clay text-cream hover:bg-clay-dark"
              type="submit"
            >
              <IoSearch size={12} />
            </button>
          </div>
          {errorCode !== 0 && (
            <p
              role="alert"
              className="w-full text-left text-[10px] text-red-600"
            >
              {errorCode === 1 ? "User not found." : "Cannot friend yourself."}
            </p>
          )}
        </form>

        {user && (
          <Friend
            assetPrefix={assetPrefix}
            data={user}
            handleSendRequest={handleSendRequest}
            handleDeleteRequest={handleDeleteRequest}
          />
        )}
      </div>

      <div className="w-full rounded-md border border-ink/10 bg-cream-accent px-2.5 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-ink-muted">
              Your friend code
            </p>
            <p className="mt-0.5 text-[9px] text-ink-muted/80">
              Share it with a friend
            </p>
          </div>
          <button
            type="button"
            aria-label="Copy your friend code"
            className={`relative flex shrink-0 flex-row items-center justify-center gap-1 rounded border border-ink/15 bg-cream px-2 py-1 text-[10px] text-ink ${profile?.friendCode ? "cursor-pointer hover:border-clay/50" : ""}`}
            onClick={() => profile?.friendCode && handleCopy()}
          >
            <span className="font-bold">
              {profile?.friendCode ?? "Loading"}
            </span>
            {profile?.friendCode && <MdContentCopy size={11} />}
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
