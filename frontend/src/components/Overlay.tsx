import styles from "./Overlay.module.css";
import { useState } from "react";
import Window from "./Window";

export default function Overlay({
  assetPrefix = "/",
}: {
  assetPrefix?: string;
}) {
  const [windowOpen, setWindowOpen] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <button
        className={styles.bttn}
        style={{
          pointerEvents: "auto",
        }}
        onClick={() => setWindowOpen((prev) => !prev)}
      >
        <img
          src={assetPrefix + "image.png"}
          alt="togglable Leetmates logo"
          style={{ width: "100%", height: "100%" }}
        />
      </button>
      <Window open={windowOpen} />
    </div>
  );
}
