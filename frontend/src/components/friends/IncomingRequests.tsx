import { useQuery } from "@tanstack/react-query";
import { fetchFriendPreviewsSchema } from "../../types/friend";
import { fetchSignedUrl } from "../../api/supabase";
import { FaCheck } from "react-icons/fa6";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { apiFetch } from "../../api/apiHelper";
import { useToast } from "../../store/toastStore";
import { genericResponseSchema } from "../../types/generic";
import { IoPeopleOutline } from "react-icons/io5";

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
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const nameTextRef = useRef<HTMLSpanElement>(null);
  const [nameOverflow, setNameOverflow] = useState(0);

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

  useEffect(() => {
    const container = nameContainerRef.current;
    const text = nameTextRef.current;
    if (!container || !text) return;

    const measureOverflow = () => {
      setNameOverflow(Math.max(0, text.scrollWidth - container.clientWidth));
    };
    measureOverflow();

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(container);
    observer.observe(text);
    return () => observer.disconnect();
  }, [data.username]);

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-ink/10 bg-cream-accent p-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          src={signedUrl ? signedUrl : assetPrefix + "defaultProfile.svg"}
          alt={data.username}
          className="h-9 w-9 shrink-0 rounded-full border-2 border-cream bg-white object-cover shadow-sm"
          draggable={false}
        />

        <div className="min-w-0 flex-1">
          <div
            ref={nameContainerRef}
            tabIndex={nameOverflow > 0 ? 0 : undefined}
            title={data.username}
            className={`incoming-request-name min-w-0 overflow-hidden text-[12px] font-semibold text-ink ${nameOverflow > 0 ? "is-overflowing" : ""}`}
            style={
              {
                "--name-overflow-distance": `${nameOverflow}px`,
              } as CSSProperties
            }
          >
            <span ref={nameTextRef} className="inline-block whitespace-nowrap">
              {data.username}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-ink-muted">
            Wants to connect with you
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 border-t border-ink/10 pt-2">
        <button
          aria-label={`Accept ${data.username}'s friend request`}
          onClick={() => handleAcceptRequest(data.id)}
          className="inline-flex h-7 items-center gap-1 rounded-md border border-clay bg-clay px-2.5 text-[10px] font-semibold text-cream transition-colors hover:bg-clay-dark hover:border-clay-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 cursor-pointer"
        >
          <FaCheck size={9} />
          Accept
        </button>

        <button
          aria-label={`Reject ${data.username}'s friend request`}
          onClick={() => handleDeleteRequest(data?.id)}
          className="inline-flex h-7 items-center gap-1 rounded-md border border-ink/15 bg-cream px-2.5 text-[10px] font-semibold text-ink-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 cursor-pointer"
        >
          <IoMdClose size={11} />
          Reject
        </button>
      </div>
    </div>
  );
}

export default function IncomingRequests() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [data, setData] = useState<FriendPreview[]>([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
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
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/20">
      {loading ? (
        <div className="flex flex-col gap-2" aria-label="Loading requests">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="h-[76px] animate-pulse rounded-lg bg-ink/[0.06]"
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-ink/15 bg-cream-muted/60 px-4 py-5 text-center">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-clay/10 text-clay">
            <IoPeopleOutline size={19} />
          </span>
          <p className="text-[11px] font-semibold text-ink">All caught up</p>
          <p className="mt-1 max-w-44 text-[10px] leading-relaxed text-ink-muted">
            New friend requests will show up here.
          </p>
        </div>
      ) : (
        <>
          <p className="px-0.5 text-[9px] font-medium uppercase tracking-wide text-ink-muted">
            {data.length} {data.length === 1 ? "request" : "requests"}
          </p>
          {data.map((user) => (
            <Friend
              key={user.id}
              data={user}
              assetPrefix={assetPrefix}
              handleAcceptRequest={handleAcceptRequest}
              handleDeleteRequest={handleDeleteRequest}
            />
          ))}
        </>
      )}
    </div>
  );
}
