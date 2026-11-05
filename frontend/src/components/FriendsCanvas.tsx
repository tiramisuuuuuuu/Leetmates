import { useEffect, useRef, useState } from "react";
import { useAssetPrefix } from "../store/assetPrefixStore";
import { useLCProblem } from "../store/leetcodeProblemStore";
import { fetchSignedUrl } from "../api/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Friend } from "../types/friend";
import { useFriends } from "../hooks/useFriends";
import { useFriendsCanvas } from "../store/friendsCanvasStore";

const BG_SVG_WIDTH = 1200;
const BG_SVG_HEIGHT = 800;

const SVG_WIDTH = 109.39;
const SVG_HEIGHT = 163;

const PROFILE_OFFSET_X = 12;
const PROFILE_OFFSET_Y = 16;
const PROFILE_WIDTH = 68;
const PROFILE_HEIGHT = 65;

function Friend({
  data,
  assetPrefix,
  scale,
}: {
  data: Friend;
  assetPrefix: string;
  scale: number;
}) {
  const { data: signedUrl } = useQuery({
    queryKey: [data.id],
    queryFn: async () => {
      if (!data.profilePath) {
        return null;
      }
      return await fetchSignedUrl(data.profilePath);
    },
    staleTime: 55 * 1000,
  });

  return (
    <div className="flex justify-center items-center relative">
      <img
        src={signedUrl ? signedUrl : assetPrefix + "defaultProfile.svg"}
        alt={data.username}
        className="object-cover select-none absolute top-0 left-0 bg-white rounded-full border-1 border-[#3D2110]"
        style={{
          width: PROFILE_WIDTH * scale,
          height: PROFILE_HEIGHT * scale,
          transform: `translate(${PROFILE_OFFSET_X * scale}px, ${PROFILE_OFFSET_Y * scale}px)`,
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
  );
}

export default function FriendsCanvas() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  // const [centeredWorldOffset, setCenteredWorldOffset] = useState({
  //   x: -300,
  //   y: 200,
  // });
  const currentProblem = useLCProblem((state) => state.currentProblem);
  // console.log("LM Current Problem: ", currentProblem);
  const friends = useFriends();
  const worldPositions = useFriendsCanvas((state) => state.worldPositions);
  const worldWidth = useFriendsCanvas((state) => state.latestPosition);
  // sanity check to ensure worldPositions and friends agree
  const displayData = worldPositions.filter((pair) =>
    Object.hasOwn(friends, pair[0]),
  );

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
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="absolute w-full h-full flex justify-start items-center overflow-x-auto"
      ref={containerRef}
    >
      <div
        id="spacer which informs scrollbar"
        className={`w-[${(worldWidth + SVG_WIDTH) * scale}px] h-1 shrink-0`}
      />
      {displayData.map(([uid, xPosition]) => (
        <div
          key={uid}
          className="absolute flex justify-center items-center"
          style={{
            transform: `translate(${xPosition * scale}px, ${200 * scale}px)`,
          }}
        >
          <Friend assetPrefix={assetPrefix} data={friends[uid]} scale={scale} />
        </div>
      ))}
    </div>
  );
}
