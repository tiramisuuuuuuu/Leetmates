import { create } from "zustand";
import type { Friend } from "../types/friend";

type Pair<K, V> = [K, V];

interface FriendsCanvasState {
  friendToIndex: {};
  worldPositions: Pair<string, number>[];
  latestPosition: number;
  addFriend: (uid: string) => void;
  removeFriend: (uid: string) => void;
  clearFriends: () => void;
  initFriends: (friends: Friend[]) => void;
}

const INITIAL_POSITION = 0;
const MIN_GAP = 70;

export const useFriendsCanvas = create<FriendsCanvasState>()((set, get) => ({
  friendToIndex: {},
  worldPositions: [],
  latestPosition: INITIAL_POSITION,
  addFriend: (uid: string) => {
    const friendsDict: Record<string, number> = { ...get().friendToIndex };
    const worldPositions = [...get().worldPositions];
    const latestPosition = get().latestPosition;

    if (Object.hasOwn(friendsDict, uid)) {
      return;
    }

    friendsDict[uid] = worldPositions.length;
    const randomPosition =
      latestPosition + Math.floor(Math.random() * 100) + MIN_GAP;
    worldPositions.push([uid, randomPosition]);
    set({
      friendToIndex: friendsDict,
      worldPositions,
      latestPosition: randomPosition,
    });
  },
  removeFriend: (uid: string) => {
    const friendsDict: Record<string, number> = { ...get().friendToIndex };
    const worldPositions = [...get().worldPositions];
    let latestPosition = get().latestPosition;

    if (!Object.hasOwn(friendsDict, uid)) {
      return;
    }

    const idx = friendsDict[uid];
    if (idx !== worldPositions.length - 1) {
      const [_, rightNeighbor] = worldPositions[idx + 1];
      let leftNeighbor = INITIAL_POSITION;
      if (idx - 1 >= 0) {
        const pair = worldPositions[idx - 1];
        leftNeighbor = pair[1];
      }

      const randomPosition =
        Math.floor(
          Math.random() * (rightNeighbor - leftNeighbor - 2 * MIN_GAP + 1),
        ) +
        leftNeighbor +
        MIN_GAP;
      worldPositions[idx] = [
        worldPositions[worldPositions.length - 1][0],
        randomPosition,
      ];
    }
    worldPositions.pop();
    delete friendsDict[uid];
    latestPosition =
      worldPositions.length > 0
        ? worldPositions[worldPositions.length - 1][1]
        : INITIAL_POSITION;
    set({ friendToIndex: friendsDict, worldPositions, latestPosition });
  },
  clearFriends: () =>
    set({
      friendToIndex: {},
      worldPositions: [],
      latestPosition: INITIAL_POSITION,
    }),
  initFriends: (friends: Friend[]) => {
    const friendsDict: Record<string, number> = {};
    const worldPositions: Pair<string, number>[] = [];
    let latestPosition = INITIAL_POSITION;

    for (const friend of friends) {
      const uid = friend.id;
      friendsDict[uid] = worldPositions.length;
      latestPosition =
        latestPosition + Math.floor(Math.random() * 100) + MIN_GAP;
      worldPositions.push([uid, latestPosition]);
    }

    set({ friendToIndex: friendsDict, worldPositions, latestPosition });
  },
}));
