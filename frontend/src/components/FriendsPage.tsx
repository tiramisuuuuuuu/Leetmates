import { CiInboxIn } from "react-icons/ci";
import { useAssetPrefix } from "../store/assetPrefixStore";
import type { Friend } from "../types/friend";
import { MdPersonAdd } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { GiCoffeeBeans } from "react-icons/gi";

function Friend({ data, assetPrefix }: { data: Friend; assetPrefix: string }) {
  return (
    <div className="group flex flex-row items-center gap-2 py-2 px-1">
      <div className="relative shrink-0">
        <img
          src={assetPrefix + "defaultProfile.svg"}
          className={`rounded-full w-9 h-9 bg-white outline outline-[1.5px] outline-offset-2 ${
            data.onLeetcode ? "outline-clay" : "outline-ink/15"
          }`}
        />
        {data.onLeetcode && (
          <div className="absolute right-0 bottom-0 rounded-full w-2 h-2 outline outline-2 outline-cream bg-clay" />
        )}
      </div>

      {/* name + description, menu style */}
      <div className="flex-1 flex flex-col items-start leading-tight">
        <div className="font-serif font-semibold text-[13px] text-ink">
          {data.username}
        </div>
        {data.leetcodeProblem ? (
          <div className="font-serif italic text-[10.5px] text-ink/60">
            now brewing — {data.leetcodeProblem}
          </div>
        ) : (
          <div className="font-serif italic text-[10.5px] text-ink/40">
            last seen {data.lastActive}
          </div>
        )}
      </div>

      {data.isFriend ? (
        <button className="shrink-0 p-1 text-ink/40 hover:text-ink transition-colors">
          <TbDotsVertical size={15} />
        </button>
      ) : (
        <button className="shrink-0 flex flex-row items-center gap-1 border border-clay text-clay hover:bg-clay hover:text-cream px-2 py-1 rounded-full text-[10.5px] font-serif font-semibold transition-colors">
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
      <span className="font-serif italic text-[13px] text-clay-dark">
        {label}
      </span>
      <span className="font-serif text-[11px] text-ink/40">({count})</span>
      <GiCoffeeBeans className="text-ink/25 shrink-0" size={11} />
      <div className="flex-1 h-px bg-ink/15" />
    </div>
  );
}

export default function FriendsPage({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);

  const friends: Friend[] = [
    {
      uid: 1,
      username: "mochi",
      onLeetcode: true,
      leetcodeProblem: "Two Sum",
      isFriend: true,
      lastActive: "Now",
    },
    {
      uid: 2,
      username: "Blade",
      onLeetcode: false,
      leetcodeProblem: null,
      isFriend: true,
      lastActive: "2 hrs ago",
    },
    {
      uid: 3,
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
    <div className="absolute top-0 left-0 w-full h-full bg-cream flex flex-col text-xs text-start overflow-hidden">
      {/* menu board header */}
      <div className="flex flex-row justify-between items-center py-2 px-3 bg-clay-dark">
        <button
          onClick={() => closeModal()}
          className="flex flex-row items-center gap-1 text-[11.5px] font-serif italic text-cream/85 hover:text-cream transition-colors"
        >
          <IoIosArrowBack size={14} />
          back to the lobby
        </button>

        <div className="relative rounded-full bg-cream/10 hover:bg-cream/20 p-1.5 cursor-pointer transition-colors">
          <CiInboxIn size={15} color="#F4F1EA" />
          <div className="absolute top-0.5 right-0.5 rounded-full w-1.5 h-1.5 outline outline-2 outline-clay-dark bg-green-400" />
        </div>
      </div>

      <div className="relative flex-1 flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-col px-3 pb-2 divide-y divide-ink/[0.06]">
          <div>
            <MenuHeading label="Online" count={online.length} />
            <div className="flex flex-col">
              {online.map((data) => (
                <Friend key={data.uid} data={data} assetPrefix={assetPrefix} />
              ))}
            </div>
          </div>

          <div>
            <MenuHeading label="Offline" count={inactive.length} />
            <div className="flex flex-col">
              {inactive.map((data) => (
                <Friend key={data.uid} data={data} assetPrefix={assetPrefix} />
              ))}
            </div>
          </div>
        </div>

        <img
          src={assetPrefix + "autumn.svg"}
          id="bg-image"
          alt="cozy autumn background"
          className="w-full select-none opacity-90 -mt-1"
          draggable={false}
        />
      </div>
    </div>
  );
}
