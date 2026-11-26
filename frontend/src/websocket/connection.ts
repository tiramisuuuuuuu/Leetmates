/// <reference types="chrome" />
// Owns the single presence WebSocket for the extension (runs in the
// background service worker). The UI reads presence from chrome.storage.

import { AUTH_STORAGE_KEY } from "../api/chromeStorage";
import {
  EMPTY_PRESENCE,
  PRESENCE_STORAGE_KEY,
  type ClientMessage,
  type FriendPresence,
  type PresenceState,
} from "../types/presence";
import { getActivity, initTabTracking } from "./listener";

const WS_URL =
  String(import.meta.env.VITE_BACKEND_URL).replace(/^http/, "ws") + "/ws";

// Must be < 30s so Chrome keeps the service worker alive while connected.
const PING_INTERVAL_MS = 20_000;
const MIN_RECONNECT_MS = 1_000;
const MAX_RECONNECT_MS = 30_000;
// Server close codes after which reconnecting immediately cannot help.
const NO_RECONNECT_CODES = new Set([4000, 4004]);

let socket: WebSocket | null = null;
let pingTimer: ReturnType<typeof setInterval> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = MIN_RECONNECT_MS;
let friends = new Map<string, FriendPresence>();

function writeState(state: PresenceState) {
  chrome.storage.local
    .set({ [PRESENCE_STORAGE_KEY]: state })
    .catch((err) => console.error("Failed to write presence state:", err));
}

function publishFriends() {
  writeState({
    connected: socket?.readyState === WebSocket.OPEN,
    friends: [...friends.values()],
  });
}

async function getAccessToken(): Promise<string | null> {
  const result = await chrome.storage.local.get(AUTH_STORAGE_KEY);
  const raw = result[AUTH_STORAGE_KEY] as string | undefined;
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    const expiresAt: number | undefined = session.expires_at; // seconds
    // Expired: wait for the UI's Supabase client to refresh it (storage change)
    if (expiresAt && expiresAt * 1000 < Date.now() + 10_000) return null;
    return session.access_token ?? null;
  } catch {
    return null;
  }
}

function send(message: ClientMessage) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

function sendActivity() {
  send({
    type: "leetcode:status",
    leetcodeProblem: getActivity().leetcodeProblem,
  });
}

function clearReconnect() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;
}

function scheduleReconnect() {
  clearReconnect();
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    sync();
  }, reconnectDelay);
  reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_MS);
}

function isFriendPresence(value: unknown): value is FriendPresence {
  if (!value || typeof value !== "object") return false;
  const friend = value as Record<string, unknown>;
  return (
    typeof friend.uid === "string" &&
    typeof friend.username === "string" &&
    (friend.profilePath === null || typeof friend.profilePath === "string") &&
    (friend.status === "offline" ||
      friend.status === "online" ||
      friend.status === "solving") &&
    (friend.leetcodeProblem === null ||
      typeof friend.leetcodeProblem === "string") &&
    (friend.lastSeen === null || typeof friend.lastSeen === "string")
  );
}

function handleMessage(event: MessageEvent) {
  if (typeof event.data !== "string") return;

  let message: unknown;
  try {
    message = JSON.parse(event.data);
  } catch {
    return;
  }

  if (!message || typeof message !== "object") return;
  const candidate = message as Record<string, unknown>;

  switch (candidate.type) {
    case "presence:snapshot":
      if (
        !isFriendPresence(candidate.self) ||
        !Array.isArray(candidate.friends) ||
        !candidate.friends.every(isFriendPresence)
      ) {
        return;
      }
      friends = new Map(
        (candidate.friends as FriendPresence[]).map((f) => [f.uid, f]),
      );
      publishFriends();
      break;
    case "presence:update":
      if (!isFriendPresence(candidate.friend)) return;
      friends.set(candidate.friend.uid, candidate.friend);
      publishFriends();
      break;
    case "error":
      if (
        typeof candidate.code !== "string" ||
        typeof candidate.message !== "string"
      )
        return;
      console.warn("Presence server error:", candidate.code, candidate.message);
      break;
  }
}

function connect(token: string) {
  const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
  socket = ws;

  ws.onopen = () => {
    reconnectDelay = MIN_RECONNECT_MS;
    sendActivity();
    pingTimer = setInterval(() => send({ type: "ping" }), PING_INTERVAL_MS);
  };

  ws.onmessage = (event) => {
    if (socket === ws) handleMessage(event);
  };

  ws.onclose = (event) => {
    if (socket !== ws) return; // stale socket we already replaced/closed
    socket = null;
    if (pingTimer) clearInterval(pingTimer);
    pingTimer = null;
    friends.clear();
    writeState(EMPTY_PRESENCE);

    if (!NO_RECONNECT_CODES.has(event.code)) scheduleReconnect();
  };
}

function disconnect() {
  clearReconnect();
  reconnectDelay = MIN_RECONNECT_MS;
  if (pingTimer) clearInterval(pingTimer);
  pingTimer = null;

  const ws = socket;
  socket = null;
  ws?.close(1000, "Client disconnect");

  friends.clear();
  writeState(EMPTY_PRESENCE);
}

// Connect while logged in with a LeetCode tab open; disconnect otherwise.
async function sync() {
  const token = await getAccessToken();
  const shouldConnect = token !== null && getActivity().onLeetcode;

  if (!shouldConnect) {
    if (socket || reconnectTimer) disconnect();
    return;
  }

  // Another tab/auth event may have completed while token storage was read.
  if (socket || reconnectTimer) return; // connected, connecting, or backing off
  connect(token);
}

function reconnectPresence() {
  clearReconnect();
  reconnectDelay = MIN_RECONNECT_MS;

  const ws = socket;
  socket = null;
  if (pingTimer) clearInterval(pingTimer);
  pingTimer = null;
  ws?.close(1000, "Retry presence connection");
  friends.clear();
  writeState(EMPTY_PRESENCE);
  void sync();
}

export function initPresenceConnection() {
  writeState(EMPTY_PRESENCE);

  initTabTracking(() => {
    sendActivity();
    sync();
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes[AUTH_STORAGE_KEY]) return;

    if (!changes[AUTH_STORAGE_KEY].newValue) {
      disconnect(); // signed out
      return;
    }
    // Signed in or token refreshed: retry now instead of waiting on backoff
    if (!socket) {
      clearReconnect();
      reconnectDelay = MIN_RECONNECT_MS;
      sync();
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "PRESENCE_RECONNECT") reconnectPresence();
  });

  sync();
}
