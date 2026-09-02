import type { WSContext } from 'hono/ws';

export type UserId = number;

export interface FriendPresence {
  uid: number;
  username: string;
  connected: boolean;
  onLeetcode: boolean;
  leetcodeProblem: string | null;
}

export interface WebsocketElement {
  websocket: WSContext;
  presence: FriendPresence;
}

export type OutputCode = 'presence:snapshot' | 'presence:update' | 'error';

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
  onLeetcode: boolean;
  leetcodeProblem?: string | null;
}

export type ClientMessage = LeetcodeStatusMessage;
