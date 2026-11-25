import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAssetPrefix } from "../store/assetPrefixStore";
import { useLCProblem } from "../store/leetcodeProblemStore";
import { fetchSignedUrl } from "../api/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Friend } from "../types/friend";
import { useFriends } from "../hooks/useFriends";
import { useFriendsCanvas } from "../store/friendsCanvasStore";
import Scrollbar from "./ui/Scrollbar";
import { useUserProfile } from "../hooks/useProfile";
import useProfilePhoto from "../hooks/useProfilePhoto";

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
  id,
  username,
  profilePath,
  leetcodeProblem,
  assetPrefix,
  scale,
}: {
  id: string;
  username: string;
  profilePath: string | null;
  leetcodeProblem: string | null;
  assetPrefix: string;
  scale: number;
}) {
  const { data: signedUrl } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      if (!profilePath) {
        return null;
      }
      return await fetchSignedUrl(profilePath);
    },
    enabled: id != "self",
    staleTime: 55 * 1000,
  });
  const ownProfileUrl = useProfilePhoto(profilePath, id != "self");

  const outfitIdx = useMemo(() => {
    return Math.floor(Math.random() * 4);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [slideDistance, setSlideDistance] = useState(0);
  const [duration, setDuration] = useState(5);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    if (!container || !textElement) return;

    const calculateSlide = () => {
      const style = window.getComputedStyle(container);
      const paddingX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

      const visibleWidth = container.clientWidth - paddingX;
      const textWidth = textElement.offsetWidth;
      const travelDistance =
        textWidth > visibleWidth ? visibleWidth - textWidth : 0;

      setSlideDistance(travelDistance);
      setDuration((-1 * travelDistance) / 40);
    };

    const observer = new ResizeObserver(calculateSlide);
    observer.observe(container);
    observer.observe(textElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center relative">
      <div
        className="absolute bottom-[100%] left-0 flex justify-center items-center mb-2"
        style={{
          width: PROFILE_WIDTH * scale, // centered with the profile picture
          transform: `translate(${PROFILE_OFFSET_X * scale}px, ${PROFILE_OFFSET_Y * scale}px)`,
        }}
      >
        <div
          ref={containerRef}
          className="max-w-24 overflow-x-clip overflow-y-visible text-[11px] leading-6 whitespace-nowrap px-2.5 bg-green-600 text-white rounded-lg shadow-md after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-green-600"
        >
          <motion.span
            ref={textRef}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
            initial={{ x: 0 }}
            animate={{ x: isHovered ? slideDistance : 0 }}
            transition={
              isHovered
                ? {
                    duration: duration,
                    ease: "linear",
                  }
                : {
                    type: "spring",
                    stiffness: 300, // Higher = faster snap
                    damping: 50, // Higher = less bounce
                    velocity: 50,
                  }
            }
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {leetcodeProblem ?? "Lorem ipsum doler sit amet"}
          </motion.span>
        </div>
      </div>
      <img
        src={
          id == "self" && ownProfileUrl
            ? ownProfileUrl
            : signedUrl
              ? signedUrl
              : assetPrefix + "defaultProfile.svg"
        }
        alt={username}
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
      <div className="absolute top-[100%] text-[12px] text-white font-semibold text-nowrap">
        {username}
      </div>
    </div>
  );
}

export default function FriendsCanvas() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const profile = useUserProfile();
  const currentProblem = useLCProblem((state) => state.currentProblem);

  const friends = useFriends();
  const addUser = useFriendsCanvas((state) => state.addFriend);
  const removeUser = useFriendsCanvas((state) => state.removeFriend);
  const worldPositions = useFriendsCanvas((state) => state.worldPositions);

  // sanity check to ensure worldPositions and friends agree
  const displayData = worldPositions.filter(
    (pair) => Object.hasOwn(friends, pair[0]) || pair[0] == "self",
  );

  useEffect(() => {
    if (currentProblem && profile) {
      addUser("self");
    } else {
      removeUser("self");
    }
  }, [currentProblem, profile, addUser, removeUser]);

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
            {uid != "self" ? (
              <Friend
                assetPrefix={assetPrefix}
                id={friends[uid].id}
                username={friends[uid].username}
                profilePath={friends[uid].profilePath}
                leetcodeProblem={friends[uid].leetcodeProblem}
                scale={scale}
              />
            ) : profile ? (
              <Friend
                assetPrefix={assetPrefix}
                id="self"
                username={profile.username}
                profilePath={profile.profilePath}
                leetcodeProblem={currentProblem}
                scale={scale}
              />
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>

      {/* Custom scrollbar */}
      <Scrollbar containerRef={containerRef} />
    </div>
  );
}
