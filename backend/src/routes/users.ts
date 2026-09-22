import { Hono } from 'hono';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { AppVariables } from '../types/variables';
import { eq } from 'drizzle-orm';
import { updateUserSchema } from '../types/user';

const userRoutes = new Hono<{ Variables: AppVariables }>();

userRoutes.post('/create', async (c) => {
  const id = c.get('uid');
  const body = await c.req.json();
  const { username, leetcodeId } = body;

  const newUser = await db
    .insert(usersTable)
    .values({ id, username, leetcodeId })
    .returning();

  return c.json(newUser, 201);
});

userRoutes.post('/update', async (c) => {
  const id = c.get('uid');
  const body = await c.req.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    console.log('Error ', parsed.error.issues);
    return c.text('Bad request body', 400);
  }

  const [user] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    return c.text('Database error', 400);
  }

  return c.json(user, 200);
});

export default userRoutes;
