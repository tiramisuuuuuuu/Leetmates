import { Hono } from 'hono';
import { db } from '../db';
import { usersTable } from '../db/schema';

const userRoutes = new Hono();

userRoutes.post('/create', async (c) => {
  const body = await c.req.json();
  const { id, username, leetcodeId } = body;

  const newUser = await db.insert(usersTable).values({ id, username, leetcodeId }).returning();

  return c.json(newUser, 201);
});

export default userRoutes;
