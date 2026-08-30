import { Hono } from 'hono';
import home from './routes/home';
import ws from './routes/ws';

const app = new Hono();

app.route('/', home);
app.route('/ws', ws);

export default app;
