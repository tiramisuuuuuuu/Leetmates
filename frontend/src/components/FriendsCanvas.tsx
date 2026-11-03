import { useEffect, useRef, useState } from "react";
import { useAssetPrefix } from "../store/assetPrefixStore";

const BG_SVG_WIDTH = 1200;
const BG_SVG_HEIGHT = 800;

const SVG_WIDTH = 109.39;
const SVG_HEIGHT = 163;

const PROFILE_OFFSET_X = 12;
const PROFILE_OFFSET_Y = 16;
const PROFILE_WIDTH = 68;
const PROFILE_HEIGHT = 65;

export default function FriendsCanvas() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [profileOffset, setProfileOffset] = useState({ x: 0, y: 0 });
  const [centeredWorldOffset, setCenteredWorldOffset] = useState({
    x: -300,
    y: 200,
  });
  const [actualOffset, setActualOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;

      let scale = 1;
      if (width / BG_SVG_WIDTH > height / BG_SVG_HEIGHT) {
        scale = width / BG_SVG_WIDTH;
      } else {
        scale = height / BG_SVG_HEIGHT;
      }

      setScale(scale);
      setActualOffset({
        x: centeredWorldOffset.x * scale,
        y: centeredWorldOffset.y * scale,
      });
      setProfileOffset({
        x: PROFILE_OFFSET_X * scale,
        y: PROFILE_OFFSET_Y * scale,
      });
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="absolute w-full h-full flex justify-center items-center"
      ref={containerRef}
    >
      <div
        className="absolute flex justify-center items-center"
        style={{
          transform: `translate(${actualOffset.x}px, ${actualOffset.y}px)`,
        }}
      >
        <img
          src={assetPrefix + "defaultProfile.svg"}
          id="profile-image"
          alt="default profile picture"
          className="object-cover select-none absolute top-0 left-0 bg-white rounded-full border-1 border-[#3D2110]"
          style={{
            width: PROFILE_WIDTH * scale,
            height: PROFILE_HEIGHT * scale,
            transform: `translate(${profileOffset.x}px, ${profileOffset.y}px)`,
          }}
          draggable={false}
        />
        <img
          src={assetPrefix + "sweater.svg"}
          id="sweater"
          alt="sweater covering profile photo"
          className="object-cover select-none z-10"
          style={{
            width: SVG_WIDTH * scale,
            height: SVG_HEIGHT * scale,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
