import { Hono } from 'hono';
import { cors } from 'hono/cors';
import userRoutes from './routes/users';
import friendRoutes from './routes/friends';
import home from './routes/home';
import ws from './routes/ws';

const app = new Hono();
console.log('Started backend server.');

app.use('*', cors());

app.use('*', async (c, next) => {
  console.log(c.req.method, c.req.path);
  await next();
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/users', userRoutes);

app.route('/friends', friendRoutes);

app.route('/', home);

app.route('/ws', ws);

export default app;
