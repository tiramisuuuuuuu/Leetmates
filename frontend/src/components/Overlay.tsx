import { useEffect, useState } from "react";
import Window from "./Window";
import { useAssetPrefix } from "../store/assetPrefixStore";
import { initAuth } from "../store/authStore";
import lmlogo from "../assets/lmlogo.png";

export default function Overlay({
  assetPrefix = "/",
}: {
  assetPrefix?: string;
}) {
  const [windowOpen, setWindowOpen] = useState(false);
  const updateAssetPrefixContext = useAssetPrefix(
    (state) => state.setAssetPrefix,
  );

  useEffect(() => {
    updateAssetPrefixContext(assetPrefix);
  }, []);

  useEffect(() => initAuth(), []);

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
        className="absolute bottom-8 right-8 bg-transparent w-20 h-20 p-0 rounded-full cursor-pointer border-1 border-black hover:border-2"
        style={{
          pointerEvents: "auto",
        }}
        onClick={() => setWindowOpen((prev) => !prev)}
      >
        <img
          src={lmlogo}
          alt="togglable Leetmates logo"
          style={{ width: "100%", height: "100%" }}
        />
      </button>
      <Window open={windowOpen} setOpen={setWindowOpen} />
    </div>
  );
}
