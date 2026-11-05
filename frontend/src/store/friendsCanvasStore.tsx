import { create } from "zustand";
import type { Friend } from "../types/friend";

type Pair<K, V> = [K, V];

interface FriendsCanvasState {
  friendToIndex: {};
  worldPositions: Pair<string, number[]>[];
  latestX: number;
  addFriend: (uid: string) => void;
  removeFriend: (uid: string) => void;
  clearFriends: () => void;
  initFriends: (friends: Friend[]) => void;
}

const INITIAL_X = 0;
const MIN_Y = 170;
const MIN_GAP = 200;

function randomY() {
  return Math.floor(Math.random() * 100) + MIN_Y;
}

export const useFriendsCanvas = create<FriendsCanvasState>()((set, get) => ({
  friendToIndex: {},
  worldPositions: [],
  latestX: INITIAL_X,
  addFriend: (uid: string) => {
    const friendsDict: Record<string, number> = { ...get().friendToIndex };
    const worldPositions = [...get().worldPositions];
    let latestX = get().latestX;
    if (latestX == INITIAL_X) {
      latestX = INITIAL_X - MIN_GAP + 80;
    }

    if (Object.hasOwn(friendsDict, uid)) {
      return;
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
    const friendsDict: Record<string, number> = { ...get().friendToIndex };
    const worldPositions = [...get().worldPositions];
    let latestX = get().latestX;

    if (!Object.hasOwn(friendsDict, uid)) {
      return;
    }

    const idx = friendsDict[uid];
    if (idx !== worldPositions.length - 1) {
      const rightNeighbor = worldPositions[idx + 1][1][0];
      let leftNeighbor = INITIAL_X;
      if (idx - 1 >= 0) {
        const pair = worldPositions[idx - 1];
        leftNeighbor = pair[1][0];
      }

      const randomPosition =
        Math.floor(
          Math.random() * (rightNeighbor - leftNeighbor - 2 * MIN_GAP + 1),
        ) +
        leftNeighbor +
        MIN_GAP;
      worldPositions[idx] = [
        worldPositions[worldPositions.length - 1][0],
        [randomPosition, randomY()],
      ];
    }
    worldPositions.pop();
    delete friendsDict[uid];
    latestX =
      worldPositions.length > 0
        ? worldPositions[worldPositions.length - 1][1][0]
        : INITIAL_X;
    set({ friendToIndex: friendsDict, worldPositions, latestX });
  },
  clearFriends: () =>
    set({
      friendToIndex: {},
      worldPositions: [],
      latestX: INITIAL_X,
    }),
  initFriends: (friends: Friend[]) => {
    const friendsDict: Record<string, number> = {};
    const worldPositions: Pair<string, number[]>[] = [];
    let latestX = INITIAL_X - MIN_GAP + 80;

    for (const friend of friends) {
      const uid = friend.id;
      friendsDict[uid] = worldPositions.length;
      latestX = latestX + Math.floor(Math.random() * 100) + MIN_GAP;
      worldPositions.push([uid, [latestX, randomY()]]);
    }

    set({ friendToIndex: friendsDict, worldPositions, latestX });
  },
}));
