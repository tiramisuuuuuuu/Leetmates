import { CiInboxIn } from "react-icons/ci";
import { useAssetPrefix } from "../store/assetPrefixStore";
import type { Friend } from "../types/friend";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { MdPersonAdd, MdPersonAddAlt } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import { IoBackspace } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

function Friend({ data, assetPrefix }: { data: Friend; assetPrefix: string }) {
  return (
    <div className="flex flex-row items-center justify-between rounded-2xl py-2 px-1 bg-amber-50">
      <div className="flex flex-row items-center gap-2">
        <div
          className={`relative rounded-full outline-2 ${data.onLeetcode ? "outline-green-500" : "outline-gray-300"} text-base `}
        >
          <img
            src={assetPrefix + "defaultProfile.svg"}
            className="rounded-full w-10 h-10"
          />

          {data.onLeetcode && (
            <div className="absolute right-0 bottom-0 rounded-full w-2 h-2 outline-1 outline-cream bg-green-500" />
          )}
        </div>

        <div className="flex flex-col items-start gap-0">
          <div className="text-ink font-semibold text-xs">{data.username}</div>

          {data.leetcodeProblem ? (
            <div className="text-xs text-white bg-[#00ff0080] rounded-full px-1.5 font-semibold">
              {/* {data.leetcodeProblem}   */}
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              Last active {data.lastActive}
            </div>
          )}
        </div>
      </div>

      {data.isFriend ? (
        <button className="p-1 px-2 rounded-xl text-[12px] flex flex-row justify-center items-center gap-1">
          <TbDotsVertical />
        </button>
      ) : (
        <button className="bg-clay p-1 px-2 rounded-xl text-[12px] text-white flex flex-row justify-center items-center gap-1 z-10">
          <MdPersonAdd color="white" size={18} />
          Send Request
        </button>
      )}
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
    <div className="absolute top-0 left-0 w-full h-full bg-cream flex flex-col text-xs text-start">
      <div className="flex flex-row justify-between items-end py-1 px-3 bg-clay-dark">
        <button
          onClick={() => closeModal()}
          className="flex flex-row items-center gap-1 text-[12px] text-white"
        >
          <IoIosArrowBack size={16} />
          Return to lobby
        </button>
        <div className="relative rounded-full bg-gray-300 p-1">
          <CiInboxIn size={16} color="gray" />
          {true && (
            <div className="absolute top-0.5 right-0.5 rounded-full w-1 h-1 bg-green-500" />
          )}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col gap-1 overflow-y-scroll pt-1">
        <div className="flex flex-col px-4 gap-1">
          Online • {online.length}
          {online.map((data) => (
            <Friend data={data} assetPrefix={assetPrefix} />
          ))}
          Offline • {inactive.length}
          {inactive.map((data) => (
            <Friend data={data} assetPrefix={assetPrefix} />
          ))}
        </div>

        <img
          src={assetPrefix + "autumn.svg"}
          id="bg-image"
          alt="cozy autumn background"
          className="w-full select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
