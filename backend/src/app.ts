import { Hono } from 'hono';
import userRoutes from './routes/users';
import friendRoutes from './routes/friends';
import home from './routes/home';
import ws from './routes/ws';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/users', userRoutes);

app.route('/friends', friendRoutes);

app.route('/', home);

app.route('/ws', ws);

export default app;
