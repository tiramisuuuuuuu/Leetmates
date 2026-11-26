import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/bun';
import { createPresenceHandler } from '../websocket/presence-handler';
import { verifyToken } from '../middleware';
import { AppVariables } from '../types/variables';

const ws = new Hono<{ Variables: AppVariables }>();

ws.get(
  '/',
  async (c, next) => {
    const token = c.req.query('token');
    if (!token) {
      return c.text('Missing token', 401);
    }

    try {
      c.set('uid', await verifyToken(token));
    } catch (error) {
      console.error('WS JWT verification failed:', error);
      return c.text('Unauthorized', 401);
    }

    return next();
  },
  upgradeWebSocket((c) => createPresenceHandler(c.get('uid')))
);

export default ws;
