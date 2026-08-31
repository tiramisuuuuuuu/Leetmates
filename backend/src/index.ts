import { Hono } from 'hono'
import userRoutes from './routes/users'
import friendRoutes from './routes/friends'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/users', userRoutes);

app.route('/friends', friendRoutes);

export default app
