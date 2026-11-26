import type { WSContext } from 'hono/ws';
import { websocketMap } from './map';
import {
  ClientMessage,
  FriendPresence,
  PresenceSnapshot,
  PresenceUpdate,
  ServerMessage,
  UserId,
} from '../types/websocket';
import { getUserInfo, getFriendList } from './db-access';

const PROBLEM_SLUG_REGEX = /^[a-z0-9-]{1,100}$/;

let nextConnectionId = 1;

type PresenceDependencies = {
  getUserInfo: typeof getUserInfo;
  getFriendList: typeof getFriendList;
};

function parseClientMessage(value: unknown): ClientMessage | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const message = value as Record<string, unknown>;
  if (message.type === 'ping') return { type: 'ping' };
  if (message.type !== 'leetcode:status') return null;

  const problem = message.leetcodeProblem;
  if (
    problem !== null &&
    (typeof problem !== 'string' || !PROBLEM_SLUG_REGEX.test(problem))
  ) {
    return null;
  }

  return { type: 'leetcode:status', leetcodeProblem: problem };
}

function send(ws: WSContext, message: ServerMessage) {
  try {
    ws.send(JSON.stringify(message));
  } catch (err) {
    console.error('Failed to send websocket message:', err);
  }
}

function presenceOf(user: {
  id: UserId;
  username: string;
  profilePath: string | null;
}): FriendPresence {
  const entry = websocketMap[user.id];
  if (entry) return { ...entry.presence };

  return {
    uid: user.id,
    username: user.username,
    profilePath: user.profilePath,
    status: 'offline',
    leetcodeProblem: null,
    lastSeen: null,
  };
}

async function broadcastToFriends(
  userId: UserId,
  presence: FriendPresence,
  getFriends: PresenceDependencies['getFriendList']
) {
  const friends = await getFriends(userId);
  const update: PresenceUpdate = { type: 'presence:update', friend: presence };

  friends.forEach((friend) => {
    const entry = websocketMap[friend.id];
    if (entry) send(entry.websocket, update);
  });
}

// Called when a friendship is created so both users see each other immediately.
export async function notifyNewFriendship(uidA: UserId, uidB: UserId) {
  const [userA, userB] = await Promise.all([
    getUserInfo(uidA),
    getUserInfo(uidB),
  ]);
  if (!userA || !userB) return;

  const entryA = websocketMap[uidA];
  const entryB = websocketMap[uidB];

  if (entryA) {
    send(entryA.websocket, {
      type: 'presence:update',
      friend: presenceOf(userB),
    });
  }
  if (entryB) {
    send(entryB.websocket, {
      type: 'presence:update',
      friend: presenceOf(userA),
    });
  }
}

export function createPresenceHandler(
  userId: UserId,
  dependencies: PresenceDependencies = { getUserInfo, getFriendList }
) {
  const connectionId = nextConnectionId++;
  // Latest problem reported by the client; may arrive before onOpen finishes.
  let leetcodeProblem: string | null = null;
  let ready = false;

  const isCurrent = () => websocketMap[userId]?.connectionId === connectionId;

  return {
    async onOpen(_event: Event, ws: WSContext) {
      const user = await dependencies.getUserInfo(userId);
      if (!user) {
        send(ws, {
          type: 'error',
          code: 'user_not_found',
          message: 'Complete your profile first',
        });
        ws.close(4004, 'User not found');
        return;
      }

      // Only one live connection per user; replace any older one.
      const previous = websocketMap[userId];
      // A newer handshake may have finished while this one was loading user data.
      if (previous && previous.connectionId > connectionId) {
        ws.close(4000, 'Replaced by newer connection');
        return;
      }
      if (previous) {
        try {
          previous.websocket.close(4000, 'Replaced by new connection');
        } catch (error) {
          console.error('Failed to close replaced websocket:', error);
        }
      }

      websocketMap[userId] = {
        connectionId,
        websocket: ws,
        presence: {
          uid: user.id,
          username: user.username,
          profilePath: user.profilePath,
          status: leetcodeProblem ? 'solving' : 'online',
          leetcodeProblem,
          lastSeen: null,
        },
      };
      ready = true;

      const friends = await dependencies.getFriendList(userId);
      if (!isCurrent()) return;

      const snapshot: PresenceSnapshot = {
        type: 'presence:snapshot',
        self: websocketMap[userId]!.presence,
        friends: friends.map(presenceOf),
      };
      send(ws, snapshot);

      await broadcastToFriends(
        userId,
        websocketMap[userId]!.presence,
        dependencies.getFriendList
      );
    },

    async onMessage(event: MessageEvent) {
      if (typeof event.data !== 'string') return;

      let rawMessage: unknown;
      try {
        rawMessage = JSON.parse(event.data);
      } catch {
        return;
      }

      const message = parseClientMessage(rawMessage);
      if (!message || message.type !== 'leetcode:status') return;

      const problem = message.leetcodeProblem;

      if (problem === leetcodeProblem) return;
      leetcodeProblem = problem;

      if (!ready || !isCurrent()) return;

      const self = websocketMap[userId]!;
      self.presence.leetcodeProblem = problem;
      self.presence.status = problem ? 'solving' : 'online';

      await broadcastToFriends(
        userId,
        { ...self.presence },
        dependencies.getFriendList
      );
    },

    async onClose() {
      if (!isCurrent()) return; // an older, replaced connection

      const entry = websocketMap[userId]!;
      delete websocketMap[userId];

      await broadcastToFriends(
        userId,
        {
          ...entry.presence,
          status: 'offline',
          leetcodeProblem: null,
          lastSeen: null,
        },
        dependencies.getFriendList
      );
    },
  };
}
