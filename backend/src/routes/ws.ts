import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/bun';
import { UserId } from '../types/websocket';
import { createPresenceHandler } from '../websocket/presence-handler';

const ws = new Hono();

ws.get(
  '/',
  async (c, next) => {
    const raw = c.req.query('userId');
    if (!raw || !Number.isInteger(Number(raw))) {
      return c.text('Missing or invalid userId parameter', 400);
    }
    return next();
  },
  upgradeWebSocket((c) => {
    const userId: UserId = Number(c.req.query('userId'));
    return createPresenceHandler(userId);
  })
);

export default ws;
