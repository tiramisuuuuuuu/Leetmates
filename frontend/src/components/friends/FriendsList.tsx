import { CiInboxIn } from "react-icons/ci";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { TbDotsVertical } from "react-icons/tb";
import { IoIosAdd, IoIosArrowBack } from "react-icons/io";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import AddFriend from "./AddFriend";
import IncomingRequests from "./IncomingRequests";
import { useQuery } from "@tanstack/react-query";
import { fetchSignedUrl } from "../../api/supabase";
import { usePresence } from "../../store/presenceStore";
import {
  formatProblemSlug,
  type FriendPresence,
  type PresenceStatus,
} from "../../types/presence";

const STATUS_STYLES: Record<
  PresenceStatus,
  { label: string; dot: string; pill: string; border: string }
> = {
  solving: {
    label: "Solving",
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/15 text-emerald-700",
    border: "border-clay",
  },
  online: {
    label: "Online",
    dot: "bg-amber-400",
    pill: "bg-amber-400/20 text-amber-700",
    border: "border-clay/60",
  },
  offline: {
    label: "Offline",
    dot: "",
    pill: "",
    border: "border-ink/20",
  },
};

const STATUS_ORDER: Record<PresenceStatus, number> = {
  solving: 0,
  online: 1,
  offline: 2,
};

function formatLastSeen(iso: string, now: number) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// Re-render periodically so "last seen" stays accurate
function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function Friend({
  data,
  assetPrefix,
  now,
}: {
  data: FriendPresence;
  assetPrefix: string;
  now: number;
}) {
  const style = STATUS_STYLES[data.status];

  const { data: signedUrl } = useQuery({
    queryKey: ["profilePhoto", data.profilePath],
    queryFn: () => fetchSignedUrl(data.profilePath!),
    enabled: !!data.profilePath,
    staleTime: 55 * 60 * 1000, // signed URLs last 1 hour
  });

  return (
    <div className="group flex flex-row items-center gap-2 py-2 px-1">
      {/* avatar */}
      <div className="relative shrink-0">
        <img
          src={signedUrl ?? assetPrefix + "defaultProfile.svg"}
          alt={data.username}
          className={`rounded-full w-8 h-8 bg-white object-cover border-2 ${style.border} ${
            data.status === "offline" ? "opacity-60" : ""
          }`}
          draggable={false}
        />

        {data.status !== "offline" && (
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 translate-0.5 rounded-full border-2 border-cream ${style.dot}`}
          />
        )}
      </div>

      {/* name + status line */}
      <div className="flex-1 min-w-0 flex flex-col items-start leading-tight">
        <div className="flex flex-row items-center gap-1.5 max-w-full">
          <span className="font-semibold text-[13px] text-ink truncate">
            {data.username}
          </span>
          {data.status !== "offline" && (
            <span
              className={`shrink-0 px-1.5 rounded-full text-[9.5px] font-semibold ${style.pill}`}
            >
              {style.label}
            </span>
          )}
        </div>

        {data.status === "solving" && data.leetcodeProblem ? (
          <div className="text-[10.5px] text-ink/60 truncate max-w-full">
            now brewing —{" "}
            <a
              href={`https://leetcode.com/problems/${data.leetcodeProblem}/`}
              target="_blank"
              rel="noreferrer"
              className="text-clay hover:underline"
            >
              {formatProblemSlug(data.leetcodeProblem)}
            </a>
          </div>
        ) : data.status === "online" ? (
          <div className="text-[10.5px] text-ink/60">browsing LeetCode</div>
        ) : (
          <div className="text-[10.5px] text-ink/40">
            {data.lastSeen
              ? `last seen ${formatLastSeen(data.lastSeen, now)}`
              : "offline"}
          </div>
        )}
      </div>

      <button className="shrink-0 p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer">
        <TbDotsVertical size={15} />
      </button>
    </div>
  );
}

function MenuHeading({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex flex-row items-center gap-2 px-1 pt-3 pb-1">
      <span className="text-[13px] text-clay-dark">{label}</span>
      <span className="text-[11px] text-ink/40">({count})</span>
      <div className="flex-1 h-px bg-ink/15" />
    </div>
  );
}

export default function FriendsList({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [modalDisplayed, setModalDisplayed] = useState<string | null>(null);
  const connected = usePresence((state) => state.connected);
  const friends = usePresence((state) => state.friends);
  const now = useNow();

  const sorted = [...friends].sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      a.username.localeCompare(b.username),
  );
  const online = sorted.filter((friend) => friend.status !== "offline");
  const offline = sorted.filter((friend) => friend.status === "offline");

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

        <div className="flex flex-row gap-1">
          <button
            className="relative rounded-full bg-cream border-1 border-1 border-clay text-clay hover:bg-clay hover:text-cream shadow-sm w-6 h-6 cursor-pointer transition-colors flex justify-center items-center"
            onClick={() => setModalDisplayed("friendRequest")}
          >
            <CiInboxIn size={15} />

            <div className="absolute top-0 right-0 rounded-full w-2.5 h-2.5 border border-2 border-cream bg-green-400" />
          </button>

          <button
            className="relative rounded-full bg-cream border-1 border-clay text-clay hover:bg-clay hover:text-cream shadow-sm w-6 h-6 cursor-pointer transition-colors flex justify-center items-center"
            onClick={() => setModalDisplayed("add")}
          >
            <IoIosAdd size={20} />
          </button>
        </div>

        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-ink">
          Friends
        </p>
      </div>

      <div className="relative flex-1 flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        {!connected ? (
          <div className="flex-1 flex justify-center items-center text-ink/50">
            Connecting…
          </div>
        ) : friends.length === 0 ? (
          <div className="flex-1 flex justify-center items-center text-ink/50">
            No friends yet — add one with the + button
          </div>
        ) : (
          <div className="flex flex-col px-3 pb-2 divide-y divide-ink/[0.06]">
            <div>
              <MenuHeading label="Online" count={online.length} />
              <div className="flex flex-col">
                {online.map((data) => (
                  <Friend
                    key={data.uid}
                    data={data}
                    assetPrefix={assetPrefix}
                    now={now}
                  />
                ))}
              </div>
            </div>

            <div>
              <MenuHeading label="Offline" count={offline.length} />
              <div className="flex flex-col">
                {offline.map((data) => (
                  <Friend
                    key={data.uid}
                    data={data}
                    assetPrefix={assetPrefix}
                    now={now}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {modalDisplayed && (
        <div className="absolute inset-12 flex justify-center items-center">
          {modalDisplayed == "add" ? (
            <Modal
              title="Add Friend"
              closeModal={() => setModalDisplayed(null)}
            >
              <AddFriend />
            </Modal>
          ) : (
            <Modal
              title="Incoming Friend Requests"
              closeModal={() => setModalDisplayed(null)}
            >
              <IncomingRequests />
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
