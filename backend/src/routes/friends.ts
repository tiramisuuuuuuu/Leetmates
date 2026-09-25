import { Hono } from 'hono';
import { db } from '../db';
import { friendRequestsTable, friendsTable, usersTable } from '../db/schema';
import { and, eq, or } from 'drizzle-orm';
import { AppVariables } from '../types/variables';

const friendRoutes = new Hono<{ Variables: AppVariables }>();

friendRoutes.post('/request', async (c) => {
  const uid = c.get('uid');
  const { recipientUid } = await c.req.json();

  const existingUsers = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.id, uid), eq(usersTable.id, recipientUid)));

  if (existingUsers.length < 2) {
    return c.text('Sender/Recipient not found', 400);
  }

  const [existingFriendRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(
      or(
        and(
          eq(friendRequestsTable.senderId, uid),
          eq(friendRequestsTable.recipientId, recipientUid)
        ),
        and(
          eq(friendRequestsTable.senderId, recipientUid),
          eq(friendRequestsTable.recipientId, uid)
        )
      )
    )
    .limit(1);

  if (existingFriendRequest) {
    return c.text('Friend request already exists', 400);
  }

  const comparison = uid.localeCompare(recipientUid);

  const [existingFriend] = await db
    .select()
    .from(friendsTable)
    .where(
      and(
        eq(friendsTable.user1Id, comparison < 0 ? uid : recipientUid),
        eq(friendsTable.user2Id, comparison > 0 ? uid : recipientUid)
      )
    )
    .limit(1);

  if (existingFriend) {
    return c.text('Already friends', 400);
  }

  const newFriendRequest = await db
    .insert(friendRequestsTable)
    .values({ senderId: uid, recipientId: recipientUid })
    .returning();

  return c.json(newFriendRequest, 201);
});

friendRoutes.post('/accept', async (c) => {
  const uid = c.get('uid');
  const { senderUid } = await c.req.json();

  const existingUsers = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.id, uid), eq(usersTable.id, senderUid)));

  if (existingUsers.length < 2) {
    return c.text('Sender/Recipient not found', 400);
  }

  const [existingFriendRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(
      and(
        eq(friendRequestsTable.senderId, senderUid),
        eq(friendRequestsTable.recipientId, uid)
      )
    )
    .limit(1);

  if (!existingFriendRequest) {
    return c.text('Friend request not found', 400);
  }

  // Skip check for existing friendship, since friend-request api should have already done that

  await db
    .delete(friendRequestsTable)
    .where(eq(friendRequestsTable.senderId, senderUid));

  const comparison = uid.localeCompare(senderUid);

  const newFriend = await db
    .insert(friendsTable)
    .values({
      user1Id: comparison < 0 ? uid : senderUid,
      user2Id: comparison > 0 ? uid : senderUid,
    })
    .returning();

  return c.json(newFriend, 201);
});

export default friendRoutes;
