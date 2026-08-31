import { Hono } from "hono";
import { db } from "../db";
import { friendRequestsTable, friendsTable, usersTable } from "../db/schema";
import { and, eq, or } from "drizzle-orm";


const friendRoutes = new Hono();


friendRoutes.post('/request', async (c) => {
  const body = await c.req.json();
  const { uid, recipientUid } = body;

  const existingUsers = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.id, uid), eq(usersTable.id, recipientUid)));

  if (existingUsers.length < 2) {
    return c.text('Sender/Recipient not found', 400);
  }

  const [ existingFriendRequest ] = await db
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

  const [ existingFriend ] = await db
    .select()
    .from(friendsTable)
    .where(
        and(
            eq(friendsTable.user1Id, Math.min(uid, recipientUid)),
            eq(friendsTable.user2Id, Math.max(uid, recipientUid))
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
})


friendRoutes.post('/accept', async (c) => {
  const body = await c.req.json();
  const { uid, senderUid } = body;

  const existingUsers = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.id, uid), eq(usersTable.id, senderUid)));
  
  if (existingUsers.length < 2) {
    return c.text('Sender/Recipient not found', 400);
  }

  const [ existingFriendRequest ] = await db
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

  const newFriend = await db
    .insert(friendsTable)
    .values({ user1Id: Math.min(uid, senderUid), user2Id: Math.max(uid, senderUid) })
    .returning();

  return c.json(newFriend, 201);
})


export default friendRoutes;