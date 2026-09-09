import { useAssetPrefix } from "../store/assetPrefixStore";
import { useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export default function Lobby() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        src={assetPrefix + (darkMode ? "bgDark.svg" : "bg.svg")}
        id="bg-image"
        alt="cozy cafe background"
        className="absolute top-0 left-0 w-full h-full object-cover select-none"
        draggable={false}
      />

      <button
        className="absolute bottom-0 right-1.5 flex items-center gap-0.5 text-white text-[12px]"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {!darkMode && (
          <>
            Light Mode <IoSunnyOutline size={16} />
          </>
        )}
        {darkMode && (
          <>
            Dark Mode <IoMoonOutline size={14} />
          </>
        )}
      </button>
    </div>
  );
}
