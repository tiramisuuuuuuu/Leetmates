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
  const [profileOffset, setProfileOffset] = useState({
    x: PROFILE_OFFSET_X,
    y: PROFILE_OFFSET_Y,
  });
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
      <img
        src={assetPrefix + "sweater.svg"}
        id="sweater"
        alt="sweater covering profile photo"
        className="object-cover select-none absolute"
        style={{
          width: SVG_WIDTH * scale,
          height: SVG_HEIGHT * scale,
          transform: `translate(${actualOffset.x}px, ${actualOffset.y}px)`,
        }}
        draggable={false}
      />
      <img
        src={assetPrefix + "sweater.svg"}
        id="sweater"
        alt="sweater covering profile photo"
        className="object-cover select-none absolute"
        style={{
          width: SVG_WIDTH * scale,
          height: SVG_HEIGHT * scale,
          transform: `translate(${actualOffset.x}px, ${actualOffset.y}px)`,
        }}
        draggable={false}
      />
    </div>
  );
}
