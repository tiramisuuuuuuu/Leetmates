import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/bun';
import type { WSContext } from 'hono/ws';

const ws = new Hono();

const onlineUsers = new Map<string, WSContext>();

// TODO: Replace this with a database query to get the friend list for the user
const testFriendList: Record<string, string[]> = {
  sreya: ['grace', 'anna'],
  grace: ['sreya'],
  anna: ['sreya']
};

ws.get(
  '/',
  async (c, next) => {
    if (!c.req.query('userId')) {
      return c.text('Missing userId parameter', 400);
    }
    return next();
  },
  upgradeWebSocket((c) => {
    const userId = c.req.query('userId')!;

    return {
      onOpen(event, ws) {
        console.log('connected', userId);
        onlineUsers.set(userId, ws);

        // Check for friends that are online and notify the user
        const onlineFriends: string[] = [];
        const offlineFriends: string[] = [];

        for (const friendId of testFriendList[userId] ?? []) {
          if (onlineUsers.has(friendId)) {
            onlineFriends.push(friendId);
          } else {
            offlineFriends.push(friendId);
          }
        }

        ws.send(
          JSON.stringify({
            type: 'friendList',
            friendsOnline: onlineFriends,
            friendsOffline: offlineFriends
          })
        );

        // Notify friends that the user is online
        if (testFriendList[userId]) {
          testFriendList[userId].forEach((friendId) => {
            const friend = onlineUsers.get(friendId);

            if (friend) {
              friend.send(JSON.stringify({ type: 'friendOnline', userId }));
            }
          });
        }
      },
      onMessage(event) {
        console.log(event.data);
      },
      onClose() {
        console.log('disconnected', userId);
        onlineUsers.delete(userId);
      }
    };
  })
);

export default ws;
