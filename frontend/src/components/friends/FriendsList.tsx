import { CiInboxIn } from "react-icons/ci";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { type Friend } from "../../types/friend";
import { MdOutlineNotificationsActive, MdPersonAdd } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import { IoIosAdd, IoIosArrowBack } from "react-icons/io";
import Modal from "../ui/Modal";
import { useEffect, useRef, useState } from "react";
import AddFriend from "./AddFriend";
import IncomingRequests from "./IncomingRequests";
import { apiFetch } from "../../api/apiHelper";
import { useToast } from "../../store/toastStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSignedUrl } from "../../api/supabase";
import Menu, { SpeechTriangle } from "../ui/Menu";
import { useFriends } from "../../hooks/useFriends";
import ConfirmationPopup from "../ui/ConfirmationPopup";
import { useUserProfile } from "../../hooks/useProfile";

type FriendAction = { kind: "remove" | "report"; friend: Friend };

function Friend({
  data,
  assetPrefix,
  onAction,
}: {
  data: Friend;
  assetPrefix: string;
  onAction: (action: FriendAction) => void;
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

  const [disablePing, setDisablePing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [timerEnd, setTimerEnd] = useState<Date | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const showToast = useToast((state) => state.showToast);

  useEffect(() => {
    if (!showActions) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!actionMenuRef.current?.contains(event.target as Node)) {
        setShowActions(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [showActions]);

  async function handlePingPressed() {
    try {
      setDisablePing(true);

      const response = await apiFetch("/push/ping", {
        method: "POST",
        body: JSON.stringify({
          friendUid: data.id,
        }),
      });

      if (!response.ok && response.status != 429) {
        console.log(" ", response.status);
        throw "Error code received";
      }

      let initialTime = 5 * 60 * 1000;
      if (response.status == 429) {
        initialTime = (await response.json())?.timeLeftMs;
      }

      const now = new Date();
      setTimerEnd(new Date(now.getTime() + initialTime));

      timerRef.current = setTimeout(() => {
        setDisablePing(false);
        setShowTooltip(false);
        setTimerEnd(null);
      }, initialTime);

      if (response.status == 429) {
        showToast("error", "Last pinged less than 5 min. ago");
      } else {
        showToast("success", "Successfully pinged friend");
      }
    } catch (error) {
      console.log("Error pinging friend: ", error);
      showToast("error", "Failed to ping friend");
      setDisablePing(false);
    }
  }

  return (
    <div className="group relative flex flex-row items-center gap-2 py-2 px-1">
      {/* avatar */}
      <div className="relative shrink-0">
        <img
          src={signedUrl ? signedUrl : assetPrefix + "defaultProfile.svg"}
          alt={data.username}
          className={`rounded-full w-8 h-8 bg-white object-cover border-2 ${
            data.onLeetcode ? "border-clay" : "border-ink/20"
          }`}
          draggable={false}
        />

        {data.onLeetcode && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 translate-0.5 rounded-full bg-emerald-500 border-2 border-cream" />
        )}
      </div>

      {/* name + description, menu style */}
      <div className="flex-1 flex flex-col items-start leading-tight">
        <div className=" font-semibold text-[13px] text-ink">
          {data.username}
        </div>
        {data.leetcodeProblem ? (
          <div className="text-[10.5px] text-ink/60">
            now brewing — {data.leetcodeProblem}
          </div>
        ) : (
          <div className="text-[10.5px] text-ink/40">
            last seen {data.lastActive}
          </div>
        )}
      </div>

      <div className="flex flex-row items-center flex-end  gap-1">
        {data.isFriend && !data.onLeetcode && data.notificationsEnabled && (
          <button
            className={`relative shrink-0 flex flex-row items-center gap-1 border ${!disablePing ? "border-clay text-clay cursor-pointer hover:bg-clay hover:text-cream" : "border-transparent bg-ink/6 text-gray-500"} px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors`}
            onClick={() => {
              if (!disablePing) {
                handlePingPressed();
              }
            }}
            onMouseEnter={() => {
              if (disablePing) {
                setShowTooltip(true);
              }
            }}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <MdOutlineNotificationsActive size={12} />
            Ping
            {showTooltip && (
              <Menu position="top">
                <p className="w-14 text-ink">
                  Ping again after{" "}
                  {timerEnd
                    ? Math.max(
                        0,
                        Math.ceil(
                          (timerEnd.getTime() - Date.now()) / (1000 * 60),
                        ),
                      )
                    : "a few"}{" "}
                  min.
                </p>
              </Menu>
            )}
          </button>
        )}
        {!data.isFriend && (
          <button className="shrink-0 flex flex-row items-center gap-1 border border-clay text-clay cursor-pointer hover:bg-clay hover:text-cream px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors">
            <MdPersonAdd size={12} />
            Add
          </button>
        )}
        <div ref={actionMenuRef} className="relative">
          <button
            aria-label={`Actions for ${data.username}`}
            aria-expanded={showActions}
            onClick={() => setShowActions((shown) => !shown)}
            className="shrink-0 text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <TbDotsVertical size={15} />
          </button>
          {showActions && (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-28 rounded-md border border-ink/20 bg-cream p-1 shadow-md">
              <SpeechTriangle
                direction="up"
                background="cream"
                borderOpacity={0.2}
                className="right-[2px] bottom-[calc(100%-1px)]"
              />
              <button
                className="block w-full rounded px-2 py-1.5 text-left text-[11px] text-ink hover:bg-ink/10"
                onClick={() => {
                  setShowActions(false);
                  onAction({ kind: "remove", friend: data });
                }}
              >
                Remove friend
              </button>
              <button
                className="block w-full rounded px-2 py-1.5 text-left text-[11px] text-red-700 hover:bg-red-500/10"
                onClick={() => {
                  setShowActions(false);
                  onAction({ kind: "report", friend: data });
                }}
              >
                Report user
              </button>
            </div>
          )}
        </div>
      </div>
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
  const [pendingAction, setPendingAction] = useState<FriendAction | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const friends = useFriends();
  const queryClient = useQueryClient();
  const showToast = useToast((state) => state.showToast);
  const profile = useUserProfile();

  async function confirmFriendAction() {
    if (!pendingAction || actionInProgress) return;
    setActionInProgress(true);
    try {
      const isRemoval = pendingAction.kind === "remove";
      const response = await apiFetch(
        isRemoval ? "/friends/remove" : "/friends/report",
        {
          method: "POST",
          body: JSON.stringify({ friendUid: pendingAction.friend.id }),
        },
      );
      if (!response.ok) throw new Error(await response.text());
      showToast(
        "success",
        isRemoval ? "Friend removed" : "Report submitted",
      );
      setPendingAction(null);
      if (isRemoval) {
        await queryClient.invalidateQueries({ queryKey: ["friends_list"] });
      }
    } catch (error) {
      console.error("Failed to process friend action:", error);
      showToast(
        "error",
        pendingAction.kind === "remove"
          ? "Could not remove friend"
          : "Could not submit report",
      );
    } finally {
      setActionInProgress(false);
    }
  }

  const online = Object.values(friends)
    .filter((friend) => friend.onLeetcode)
    .sort((a, b) => Number(a.isFriend) - Number(b.isFriend));

  const inactive = Object.values(friends)
    .filter((friend) => !friend.onLeetcode)
    .sort((a, b) => Number(a.isFriend) - Number(b.isFriend));

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-cream/80 backdrop-blur-md flex flex-col text-xs text-start overflow-hidden">
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
            className="relative rounded-full bg-cream border-1 border-clay text-clay hover:bg-clay hover:text-cream shadow-sm w-6 h-6 cursor-pointer transition-colors flex justify-center items-center"
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
        {online.length + inactive.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 pb-5 text-center">
            <img
              src={assetPrefix + "friends-empty.svg"}
              alt="Two Leetmates meeting over a warm cup of coffee"
              className="mb-3 h-28 w-36 select-none object-contain"
              draggable={false}
            />
            <p className="text-[13px] font-semibold text-ink">Your table is open</p>
            <p className="mt-1 max-w-56 text-[11px] leading-relaxed text-ink-muted">
              Add a friend to study together.
              {profile?.matchingPreference === "everyone" &&
                " Or hang out here and we’ll match you with a new Leetmate."}
            </p>
            <button
              onClick={() => setModalDisplayed("add")}
              className="mt-3 rounded-full border border-clay px-3 py-1 text-[11px] font-semibold text-clay hover:bg-clay hover:text-cream transition-colors"
            >
              Add a friend
            </button>
          </div>
        ) : (
          <div className="flex flex-col px-3 pb-2 divide-y divide-ink/[0.06]">
            <div>
              <MenuHeading label="Online" count={online.length} />
              <div className="flex flex-col">
                {online.map((data) => (
                  <Friend
                    key={data.id}
                    data={data}
                    assetPrefix={assetPrefix}
                    onAction={setPendingAction}
                  />
                ))}
              </div>
            </div>

            <div>
              <MenuHeading label="Offline" count={inactive.length} />
              <div className="flex flex-col">
                {inactive.map((data) => (
                  <Friend
                    key={data.id}
                    data={data}
                    assetPrefix={assetPrefix}
                    onAction={setPendingAction}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* <img
          src={assetPrefix + "autumn.svg"}
          id="bg-image"
          alt="cozy autumn background"
          className="w-full select-none opacity-90 -mt-1"
          draggable={false}
        /> */}
      </div>

      {modalDisplayed && (
        <div className="absolute inset-12 z-40 flex justify-center items-center">
          {modalDisplayed == "add" ? (
            <Modal
              title="Add Friend"
              closeModal={() => setModalDisplayed(null)}
            >
              <AddFriend />
            </Modal>
          ) : (
            <Modal
              title="Incoming Requests"
              closeModal={() => setModalDisplayed(null)}
            >
              <IncomingRequests />
            </Modal>
          )}
        </div>
      )}

      {pendingAction && (
        <ConfirmationPopup
          title={
            pendingAction.kind === "remove" ? "Remove friend?" : "Report user?"
          }
          message={
            pendingAction.kind === "remove"
              ? `Remove ${pendingAction.friend.username} from your friends?`
              : `Send a report about ${pendingAction.friend.username} to the Leetmates team?`
          }
          confirmLabel={pendingAction.kind === "remove" ? "Remove" : "Report"}
          destructive={pendingAction.kind === "report"}
          busy={actionInProgress}
          onConfirm={confirmFriendAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}
