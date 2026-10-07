import { Hono } from 'hono';
import { db } from '../db';
import { friendRequestsTable, friendsTable, usersTable } from '../db/schema';
import { AppVariables } from '../types/variables';
import { and, eq, or } from 'drizzle-orm';
import { updateUserSchema } from '../types/user';
import { DatabaseError } from 'pg';

const userRoutes = new Hono<{ Variables: AppVariables }>();

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateFriendCode(length = 8): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

userRoutes.post('/create', async (c) => {
  const id = c.get('uid');
  const body = await c.req.json();
  const { username, leetcodeId } = body;

  const MAX_RETRIES = 5;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const friendCode = generateFriendCode();
    try {
      const newUser = await db
        .insert(usersTable)
        .values({ id, username, leetcodeId, friendCode })
        .returning();

      return c.json(newUser, 201);
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === '23505' &&
        error.constraint === 'users_friend_code_unique'
      ) {
        continue;
      }

      throw error;
    }
  }

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

userRoutes.get('/:friendCode', async (c) => {
  const id = c.get('uid');
  const { friendCode } = c.req.param();

  const [user] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      profilePath: usersTable.profilePath,
    })
    .from(usersTable)
    .where(eq(usersTable.friendCode, friendCode))
    .limit(1);

  if (!user) {
    return c.text('User not found', 400);
  }

  let friendStatus = null;
  const recipientUid = user.id;
  const comparison = id.localeCompare(recipientUid);

  const [existingFriend] = await db
    .select()
    .from(friendsTable)
    .where(
      and(
        eq(friendsTable.user1Id, comparison < 0 ? id : recipientUid),
        eq(friendsTable.user2Id, comparison > 0 ? id : recipientUid)
      )
    )
    .limit(1);

  if (existingFriend) {
    friendStatus = 'Friends';
  } else {
    const [existingFriendRequest] = await db
      .select()
      .from(friendRequestsTable)
      .where(
        or(
          and(
            eq(friendRequestsTable.senderId, id),
            eq(friendRequestsTable.recipientId, recipientUid)
          ),
          and(
            eq(friendRequestsTable.senderId, recipientUid),
            eq(friendRequestsTable.recipientId, id)
          )
        )
      )
      .limit(1);

    if (existingFriendRequest) {
      if (existingFriendRequest.senderId === id) {
        friendStatus = 'Requested';
      } else {
        friendStatus = 'Incoming request';
      }
    }
  }

  return c.json({ ...user, friendStatus }, 201);
});

userRoutes.get('/', async (c) => {
  const id = c.get('uid');

  const [user] = await db
    .select({
      username: usersTable.username,
      profilePath: usersTable.profilePath,
      countryCode: usersTable.countryCode,
      currentStatus: usersTable.currentStatus,
      matchingPreference: usersTable.matchingPreference,
      friendCode: usersTable.friendCode,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  if (!user) {
    return c.text('User not found', 400);
  }

  return c.json(user, 201);
});

export default userRoutes;
