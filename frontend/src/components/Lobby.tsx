import { useAssetPrefix } from "../store/assetPrefixStore";
import { useAuth } from "../store/authStore";
import { useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import Auth from "./auth/Auth";
import Profile from "./auth/Profile";
import Toast from "./Toast";
import CompleteProfile from "./profile/CompleteProfile";

export default function Lobby() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [darkMode, setDarkMode] = useState(false);
  const isLoggedIn = useAuth((state) => state.session !== null);
  const authLoading = useAuth((state) => state.loading);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
      className="[container-type:size]"
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

      <div className="absolute inset-12 [@container(max-width:420px)]:inset-5 [@container(max-height:320px)]:inset-5">
        <CompleteProfile />
      </div>

      {!authLoading && !isLoggedIn && (
        <div className="absolute inset-5">
          <Auth />
        </div>
      )}
      {isLoggedIn && (
        <div className="absolute bottom-1 left-1.5">
          <Profile />
        </div>
      )}

      <Toast />
    </div>
  );
}
