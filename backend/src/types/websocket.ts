import type { WSContext } from 'hono/ws';

export type UserId = string;

// offline: no open connection
// online:  connected, browsing LeetCode
// solving: connected, currently on a LeetCode problem page
export type PresenceStatus = 'offline' | 'online' | 'solving';

export interface FriendPresence {
  uid: UserId;
  username: string;
  profilePath: string | null;
  status: PresenceStatus;
  leetcodeProblem: string | null; // problem slug, e.g. "two-sum"
  lastSeen: string | null; // ISO timestamp of last disconnect (null if online / unknown)
}

export interface WebsocketElement {
  connectionId: number;
  websocket: WSContext;
  presence: FriendPresence;
}

export interface PresenceSnapshot {
  type: 'presence:snapshot';
  self: FriendPresence;
  friends: FriendPresence[];
}

export interface PresenceUpdate {
  type: 'presence:update';
  friend: FriendPresence;
}

export interface ErrorMessage {
  type: 'error';
  code: string;
  message: string;
}

export type ServerMessage = PresenceSnapshot | PresenceUpdate | ErrorMessage;

export interface LeetcodeStatusMessage {
  type: 'leetcode:status';
  leetcodeProblem: string | null;
}

export interface PingMessage {
  type: 'ping';
}

export type ClientMessage = LeetcodeStatusMessage | PingMessage;
