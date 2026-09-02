import { websocket } from 'hono/bun';
import app from './app';

Bun.serve({
  port: 3000,
  fetch: app.fetch,
  websocket
});
