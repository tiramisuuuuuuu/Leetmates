import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdContentCopy, MdPersonAdd } from "react-icons/md";
import Menu from "./Menu";
import type { Friend } from "../../types/friend";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { apiFetch } from "../../api/apiHelper";

const YOUR_CODE = "ABC123";

function Friend({ data, assetPrefix }: { data: Friend; assetPrefix: string }) {
  return (
    <div className="group flex flex-row items-center gap-3 py-2 px-1">
      <div className="flex flex-row items-center gap-2">
        <img
          src={assetPrefix + "defaultProfile.svg"}
          alt={data.username}
          className="rounded-full w-8 h-8 bg-white object-cover"
        />

        <div className="flex-1 flex flex-col items-start leading-tight">
          <div className=" font-semibold text-[13px] text-ink">
            {data.username}
          </div>
        </div>
      </div>

      <button className="shrink-0 flex flex-row items-center gap-1 border border-clay text-clay cursor-pointer hover:bg-clay hover:text-cream px-2 py-1 rounded-full text-[10.5px] font-semibold transition-colors">
        <MdPersonAdd size={12} />
        Add
      </button>
    </div>
  );
}

export default function AddFriend() {
  const [friendCode, setFriendCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<Friend | null>();
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(YOUR_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  async function handleSubmit() {
    const found = {
      uid: 1,
      username: "mochi",
      onLeetcode: true,
      leetcodeProblem: "Two Sum",
      isFriend: true,
      lastActive: "Now",
    };
    setUser(found);

    // try {
    //   const newFriend = await apiFetch("/friends/request", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       friendCode
    //     }),
    //   });
    // } catch (err) {
    //   console.error("Failed to add friend via code: ", err);
    // }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between items-center">
      <p className="text-xs text-ink-muted">Find friend using their code</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full flex justify-center items-center"
      >
        <div className="flex flex-row items-center bg-cream-muted border border-ink/30 rounded-md w-full max-w-60 h-7 overflow-hidden">
          <input
            type="text"
            placeholder="Search user code"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            className="flex-1 min-w-0 h-full pl-2.5 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none"
          />

          <button
            className="bg-clay text-cream w-7 h-full flex justify-center items-center"
            type="submit"
          >
            <IoSearch size={12} />
          </button>
        </div>
      </form>

      {user && <Friend assetPrefix={assetPrefix} data={user} />}

      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-px bg-ink/15" />
        <div className="flex flex-row justify-center items-center gap-2">
          <p className=" text-ink-muted text-[12px]">Your code:</p>
          <button
            className="relative p-1 px-2 border-1 border-ink/40 hover:bg-ink/10 rounded-[10px] flex flex-row justify-center items-center gap-1 text-ink-muted"
            onClick={handleCopy}
          >
            <p className="text-ink font-bold ">{YOUR_CODE}</p>
            <MdContentCopy />
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
