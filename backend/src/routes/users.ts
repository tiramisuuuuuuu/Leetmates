import { Hono } from 'hono';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { AppVariables } from '../types/variables';

const userRoutes = new Hono<{ Variables: AppVariables }>();

userRoutes.post('/create', async (c) => {
  const id = c.get('uid');
  const body = await c.req.json();
  const { username, leetcodeId, displayName } = body;

  const newUser = await db
    .insert(usersTable)
    .values({ id, username, leetcodeId })
    .returning();

  return c.json(newUser, 201);
});

export default userRoutes;
