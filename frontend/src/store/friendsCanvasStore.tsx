import { create } from "zustand";
import type { Friend } from "../types/friend";

type Pair<K, V> = [K, V];

interface FriendsCanvasState {
  friendToIndex: Record<string, number>;
  worldPositions: Pair<string, number[]>[];
  latestX: number;
  addFriend: (uid: string) => void;
  removeFriend: (uid: string) => void;
  clearFriends: () => void;
  initFriends: (friends: Friend[]) => void;
}

const INITIAL_X = 0;
const MIN_Y = 170;
const MIN_GAP = 230;

function randomY() {
  return Math.floor(Math.random() * 80) + MIN_Y;
}

export const useFriendsCanvas = create<FriendsCanvasState>()((set, get) => ({
  friendToIndex: {},
  worldPositions: [],
  latestX: INITIAL_X,
  addFriend: (uid: string) => {
    if (Object.hasOwn(get().friendToIndex, uid)) {
      return;
    }

    const friendsDict: Record<string, number> = { ...get().friendToIndex };
    const worldPositions = [...get().worldPositions];
    let latestX = get().latestX;
    if (latestX == INITIAL_X) {
      latestX = INITIAL_X - MIN_GAP + 80;
    }

    friendsDict[uid] = worldPositions.length;
    const randomX = latestX + Math.floor(Math.random() * 100) + MIN_GAP;
    worldPositions.push([uid, [randomX, randomY()]]);
    set({
      friendToIndex: friendsDict,
      worldPositions,
      latestX: randomX,
    });
  },
  removeFriend: (uid: string) => {
    const { friendToIndex, worldPositions } = get();

    if (!Object.hasOwn(friendToIndex, uid)) {
      return;
    }

    const idx = friendToIndex[uid];

    const updatedPositions = [...worldPositions];
    updatedPositions.splice(idx, 1);

    const updatedDict: Record<string, number> = {};

    updatedPositions.forEach(([friendUid], index) => {
      updatedDict[friendUid] = index;
    });

    const latestX =
      updatedPositions.length > 0
        ? updatedPositions[updatedPositions.length - 1][1][0]
        : INITIAL_X;

    set({
      friendToIndex: updatedDict,
      worldPositions: updatedPositions,
      latestX,
    });
  },
  clearFriends: () =>
    set({
      friendToIndex: {},
      worldPositions: [],
      latestX: INITIAL_X,
    }),
  initFriends: (friends: Friend[]) => {
    const friendsDict: Record<string, number> = { ...get().friendToIndex }; // previous list might contain "self"
    const worldPositions = [...get().worldPositions];
    let latestX = get().latestX;
    if (latestX == INITIAL_X) {
      latestX = INITIAL_X - MIN_GAP + 80;
    }

    for (const friend of friends) {
      const uid = friend.id;

      if (Object.hasOwn(friendsDict, uid)) {
        continue;
      }

      friendsDict[uid] = worldPositions.length;
      latestX = latestX + Math.floor(Math.random() * 100) + MIN_GAP;
      worldPositions.push([uid, [latestX, randomY()]]);
    }

    set({ friendToIndex: friendsDict, worldPositions, latestX });
  },
}));
