import type { WSContext } from 'hono/ws';
import { websocketMap } from './map';
import { PresenceSnapshot, PresenceUpdate, UserId } from '../types/websocket';
import { getUserInfo, getFriendList } from './db-access';

export function createPresenceHandler(userId: UserId) {
  return {
    async onOpen(event: Event, ws: WSContext) {
      const user = await getUserInfo(userId);

      websocketMap[userId] = {
        websocket: ws,
        presence: {
          uid: Number(userId),
          username: user!.username,
          connected: true,
          onLeetcode: false,
          leetcodeProblem: null
        }
      };

      // Check for friends that are online and notify the user
      const friends = await getFriendList(userId);
      const friendsPresence = friends.map((friend) => ({
        uid: friend.id,
        username: friend.username,
        connected: websocketMap[friend.id]?.presence.connected ?? false,
        onLeetcode: websocketMap[friend.id]?.presence.onLeetcode ?? false,
        leetcodeProblem: websocketMap[friend.id]?.presence.leetcodeProblem ?? null
      }));

      const snapshot: PresenceSnapshot = {
        type: 'presence:snapshot',
        self: websocketMap[userId]!.presence,
        friends: friendsPresence
      };
      ws.send(JSON.stringify(snapshot));

      // Notify friends that the user is online
      friends.forEach((friend) => {
        if (websocketMap[friend.id]) {
          const update: PresenceUpdate = {
            type: 'presence:update',
            friend: websocketMap[userId]!.presence
          };
          websocketMap[friend.id].websocket.send(JSON.stringify(update));
        }
      });
    },
    onMessage(event: MessageEvent) {
      console.log(event.data);
    },
    async onClose() {
      const user = websocketMap[userId];
      delete websocketMap[userId];

      // Notify friends that user went offline
      if (user) {
        const friends = await getFriendList(userId);
        friends.forEach((friend) => {
          if (websocketMap[friend.id]) {
            const update: PresenceUpdate = {
              type: 'presence:update',
              friend: {
                uid: userId,
                username: user.presence.username,
                connected: false,
                onLeetcode: false,
                leetcodeProblem: null
              }
            };
            websocketMap[friend.id].websocket.send(JSON.stringify(update));
          }
        });
      }
    }
  };
}
