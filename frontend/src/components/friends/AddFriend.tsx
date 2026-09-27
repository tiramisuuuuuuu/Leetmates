import { useState } from "react";
import { BsAlphabet } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";

const YOUR_CODE = "ABC123";

export default function AddFriend() {
  const [friendCode, setFriendCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(YOUR_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center ">
      <p className="text-xs text-ink-muted">Add friend using their code</p>

      <div className="flex items-center gap-2 bg-cream-muted border border-ink/30 rounded-md px-2.5 py-0.5">
        <IoSearch size={14} className="shrink-0 text-ink-muted opacity-70" />
        <input
          type="text"
          placeholder="Enter code"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
          className="w-full min-w-0 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none"
        />
      </div>

      <div className="w-full h-px bg-ink/15" />

      <div className="flex flex-row justify-center items-center gap-2">
        <p className=" text-ink-muted text-[10px]">Your code:</p>
        <button
          className="p-1 px-2 border-1 border-ink/40 hover:bg-ink/10 rounded-[10px] flex flex-row justify-center items-center gap-1 text-ink-muted"
          onClick={handleCopy}
        >
          <p className="text-ink font-bold ">{YOUR_CODE}</p>
          <MdContentCopy />
        </button>
      </div>
    </div>
  );
}
