import { CiInboxIn } from "react-icons/ci";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { fetchFriendsSchema, type Friend } from "../../types/friend";
import { MdOutlineNotificationsActive, MdPersonAdd } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import { IoIosAdd, IoIosArrowBack } from "react-icons/io";
import Modal from "../ui/Modal";
import { useEffect, useRef, useState } from "react";
import AddFriend from "./AddFriend";
import IncomingRequests from "./IncomingRequests";
import { apiFetch } from "../../api/apiHelper";
import { useToast } from "../../store/toastStore";
import { useQuery } from "@tanstack/react-query";
import { fetchSignedUrl } from "../../api/supabase";
import Menu from "../ui/Menu";

function Friend({ data, assetPrefix }: { data: Friend; assetPrefix: string }) {
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
  const [showTooltip, setShowTooltip] = useState(false);
  const showToast = useToast((state) => state.showToast);

  async function handlePingPressed() {
    try {
      setDisablePing(true);

      const response = await apiFetch("/push/ping", {
        method: "POST",
        body: JSON.stringify({
          friendUid: data.id,
        }),
      });

      if (!response.ok) {
        throw "Error code received";
      }

      timerRef.current = setTimeout(
        () => {
          setDisablePing(false);
          setShowTooltip(false);
        },
        5 * 60 * 1000,
      );

      showToast("success", "Successfully pinged friend");
    } catch (error) {
      console.log("Error pinging friend: ", error);
      showToast("error", "Failed to ping friend");
      setDisablePing(false);
    }
  }

  return (
    <div className="group flex flex-row items-center gap-2 py-2 px-1">
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
            className={`relative shrink-0 flex flex-row items-center gap-1 border ${!disablePing ? "border-clay text-clay cursor-pointer hover:bg-clay hover:text-cream" : "border-gray-300 bg-gray-300 text-white"} px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors`}
            onClick={() => {
              !disablePing && handlePingPressed();
            }}
            onMouseEnter={() => {
              disablePing && setShowTooltip(true);
            }}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <MdOutlineNotificationsActive size={12} />
            Ping
            {showTooltip && (
              <Menu position="top">
                <p className="w-14 text-ink-muted">Ping again after 5 min.</p>
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
        <button className="shrink-0 text-ink-muted hover:text-ink transition-colors cursor-pointer">
          <TbDotsVertical size={15} />
        </button>
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
  const [realFriends, setRealFriends] = useState<Friend[]>([]);

  const friends: Friend[] = [
    {
      id: "00000000-0000-0000-0000-000000000000",
      username: "mochi",
      onLeetcode: true,
      leetcodeProblem: "Two Sum",
      isFriend: true,
      lastActive: "Now",
      profilePath: null,
    },
    {
      id: "00000000-0000-0000-0000-000000000001",
      username: "Blade",
      onLeetcode: false,
      leetcodeProblem: null,
      isFriend: true,
      lastActive: "2 hrs ago",
      notificationsEnabled: false,
      profilePath: null,
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      username: "Bob A.",
      onLeetcode: true,
      leetcodeProblem: "Linked List",
      isFriend: false,
      lastActive: "Now",
      profilePath: null,
    },
  ];

  const online = friends
    .filter((friend) => friend.onLeetcode)
    .sort((a, b) => Number(a.isFriend) - Number(b.isFriend));

  const inactive = [
    ...friends.filter((friend) => !friend.onLeetcode),
    ...realFriends,
  ];

  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await apiFetch("/friends");
        const body = await response.json();
        const parsed = fetchFriendsSchema.safeParse(body);

        if (!parsed.success) {
          console.log("Error ", parsed.error.issues);
          throw "Zod Error";
        }

        setRealFriends(parsed.data);
      } catch (err) {
        console.error("Failed to fetch profile: ", err);
      }
    }

    fetchFriends();
  }, []);

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
        <div className="flex flex-col px-3 pb-2 divide-y divide-ink/[0.06]">
          <div>
            <MenuHeading label="Online" count={online.length} />
            <div className="flex flex-col">
              {online.map((data) => (
                <Friend key={data.id} data={data} assetPrefix={assetPrefix} />
              ))}
            </div>
          </div>

          <div>
            <MenuHeading label="Offline" count={inactive.length} />
            <div className="flex flex-col">
              {inactive.map((data) => (
                <Friend key={data.id} data={data} assetPrefix={assetPrefix} />
              ))}
            </div>
          </div>
        </div>

        {/* <img
          src={assetPrefix + "autumn.svg"}
          id="bg-image"
          alt="cozy autumn background"
          className="w-full select-none opacity-90 -mt-1"
          draggable={false}
        /> */}
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
              title="Incoming Requests"
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
