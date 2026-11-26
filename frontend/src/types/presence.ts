// Mirrors backend/src/types/websocket.ts

export type PresenceStatus = "offline" | "online" | "solving";

export interface FriendPresence {
  uid: string;
  username: string;
  profilePath: string | null;
  status: PresenceStatus;
  leetcodeProblem: string | null; // problem slug, e.g. "two-sum"
  lastSeen: string | null; // ISO timestamp
}

export type ServerMessage =
  | {
      type: "presence:snapshot";
      self: FriendPresence;
      friends: FriendPresence[];
    }
  | { type: "presence:update"; friend: FriendPresence }
  | { type: "error"; code: string; message: string };

export type ClientMessage =
  | { type: "leetcode:status"; leetcodeProblem: string | null }
  | { type: "ping" };

// Written by the background worker, read by the UI.
export const PRESENCE_STORAGE_KEY = "leetmates-presence";

export interface PresenceState {
  connected: boolean;
  friends: FriendPresence[];
}

export const EMPTY_PRESENCE: PresenceState = { connected: false, friends: [] };

// "two-sum" -> "Two Sum"
export function formatProblemSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
