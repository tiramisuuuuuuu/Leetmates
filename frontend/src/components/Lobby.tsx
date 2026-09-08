import styles from "./Lobby.module.css";
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
        alt="cozy cafe background"
        className={styles.bgImg}
        draggable={false}
      />

      <button
        className={styles.lightDark}
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {!darkMode && (
          <>
            Light Mode <IoSunnyOutline size={15} />
          </>
        )}
        {darkMode && (
          <>
            Dark Mode <IoMoonOutline size={15} />
          </>
        )}
      </button>
    </div>
  );
}
