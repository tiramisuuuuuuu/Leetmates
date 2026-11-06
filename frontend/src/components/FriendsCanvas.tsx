import { useEffect, useMemo, useRef, useState } from "react";
import { useAssetPrefix } from "../store/assetPrefixStore";
import { useLCProblem } from "../store/leetcodeProblemStore";
import { fetchSignedUrl } from "../api/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Friend } from "../types/friend";
import { useFriends } from "../hooks/useFriends";
import { useFriendsCanvas } from "../store/friendsCanvasStore";
import Scrollbar from "./ui/Scrollbar";

const BG_SVG_WIDTH = 1200;
const BG_SVG_HEIGHT = 800;

const SVG_OUTFITS = [
  { path: "outfits/sweater.svg", width: 109.39, height: 163 },
  { path: "outfits/mug.svg", width: 92, height: 163 },
  { path: "outfits/book.svg", width: 92.49, height: 163 },
  { path: "outfits/beret.svg", width: 109.39, height: 163 },
];

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

  const outfitIdx = useMemo(() => {
    return Math.floor(Math.random() * 4);
  }, []);

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
        src={assetPrefix + SVG_OUTFITS[outfitIdx].path}
        id="sweater"
        alt="sweater covering profile photo"
        className="object-cover select-none z-10"
        style={{
          width: SVG_OUTFITS[outfitIdx].width * scale,
          height: SVG_OUTFITS[outfitIdx].height * scale,
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
    <div className="absolute inset-0">
      {/* Actual scrollable world */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex justify-start items-center overflow-hidden"
      >
        {displayData.map(([uid, position]) => (
          <div
            key={uid}
            className="absolute flex justify-center items-center"
            style={{
              transform: `translate(${position[0] * scale}px, ${position[1] * scale}px)`,
            }}
          >
            <Friend
              assetPrefix={assetPrefix}
              data={friends[uid]}
              scale={scale}
            />
          </div>
        ))}
      </div>

      {/* Custom scrollbar */}
      <Scrollbar containerRef={containerRef} />
    </div>
  );
}
