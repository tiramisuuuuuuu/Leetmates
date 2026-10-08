import { CiInboxIn } from "react-icons/ci";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import type { Friend } from "../../types/friend";
import { MdPersonAdd } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import { IoIosAdd, IoIosArrowBack } from "react-icons/io";
import Modal from "./Modal";
import { useState } from "react";
import AddFriend from "./AddFriend";

function Friend({ data, assetPrefix }: { data: Friend; assetPrefix: string }) {
  return (
    <div className="group flex flex-row items-center gap-2 py-2 px-1">
      {/* avatar */}
      <div className="relative shrink-0">
        <img
          src={assetPrefix + "defaultProfile.svg"}
          alt={data.username}
          className={`rounded-full w-8 h-8 bg-white object-cover border-2 ${
            data.onLeetcode ? "border-clay" : "border-ink/20"
          }`}
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

      {data.isFriend ? (
        <button className="shrink-0 p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer">
          <TbDotsVertical size={15} />
        </button>
      ) : (
        <button className="shrink-0 flex flex-row items-center gap-1 border border-clay text-clay cursor-pointer hover:bg-clay hover:text-cream px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors">
          <MdPersonAdd size={12} />
          Add
        </button>
      )}
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

  const friends: Friend[] = [
    {
      id: "1",
      username: "mochi",
      onLeetcode: true,
      leetcodeProblem: "Two Sum",
      isFriend: true,
      lastActive: "Now",
    },
    {
      id: "2",
      username: "Blade",
      onLeetcode: false,
      leetcodeProblem: null,
      isFriend: true,
      lastActive: "2 hrs ago",
    },
    {
      id: "3",
      username: "Bob A.",
      onLeetcode: true,
      leetcodeProblem: "Linked List",
      isFriend: false,
      lastActive: "Now",
    },
  ];

  const online = friends
    .filter((friend) => friend.onLeetcode)
    .sort((a, b) => Number(a.isFriend) - Number(b.isFriend));

  const inactive = friends.filter((friend) => !friend.onLeetcode);

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
              title="Incoming Friend Requests"
              closeModal={() => setModalDisplayed(null)}
            >
              <div />
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
