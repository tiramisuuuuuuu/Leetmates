import { useEffect, useState } from "react";
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
import { fetchProfileSchema } from "../../types/profile";
import { useToast } from "../../store/toastStore";
import { genericResponseSchema } from "../../types/generic";

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

      {data.friendStatus === "Friends" && (
        <p className="text-ink-muted text-[12px] text-center">Friends</p>
      )}

      {data.friendStatus === "Requested" && (
        <button
          onClick={() => handleDeleteRequest(data.id)}
          className="shrink-0 flex flex-row items-center gap-1 border bg-clay border-clay text-cream cursor-pointer hover:border-clay-dark hover:bg-clay-dark px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors"
        >
          Pending
          <FaClock size={12} />
        </button>
      )}

      {(data.friendStatus === null ||
        data.friendStatus === "Incoming request") && (
        <button
          onClick={() => handleSendRequest(data.id)}
          className="shrink-0 flex flex-row items-center gap-1 border border-clay text-clay cursor-pointer hover:bg-clay hover:text-cream px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors"
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
  const profile = useProfile((state) => state.profile);
  const showToast = useToast((state) => state.showToast);

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

      {user && (
        <Friend
          assetPrefix={assetPrefix}
          data={user}
          handleSendRequest={handleSendRequest}
          handleDeleteRequest={handleDeleteRequest}
        />
      )}

      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-px bg-ink/15" />
        <div className="flex flex-row justify-center items-center gap-2">
          <p className="text-ink-muted text-[12px]">Your code:</p>
          <button
            className={`relative p-1 px-2 border-1 border-ink/40 ${profile?.friendCode ? "hover:bg-ink/10" : ""} rounded-[8px] flex flex-row justify-center items-center gap-1 text-ink-muted`}
            onClick={() => profile?.friendCode && handleCopy()}
          >
            <p className="text-ink font-bold ">
              {profile?.friendCode ?? "Loading"}
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
