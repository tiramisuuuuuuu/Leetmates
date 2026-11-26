import { db } from '../db';
import { usersTable, friendsTable } from '../db/schema';
import { eq, or, inArray } from 'drizzle-orm';
import type { UserId } from '../types/websocket';

export async function getUserInfo(uid: UserId) {
  const [user] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      profilePath: usersTable.profilePath
    })
    .from(usersTable)
    .where(eq(usersTable.id, uid))
    .limit(1);

  return user;
}

export async function getFriendList(uid: UserId) {
  const friendships = await db
    .select()
    .from(friendsTable)
    .where(or(eq(friendsTable.user1Id, uid), eq(friendsTable.user2Id, uid)));

  const friendIds = friendships.map((friendship) =>
    friendship.user1Id === uid ? friendship.user2Id : friendship.user1Id
  );

  if (friendIds.length === 0) {
    return [];
  }

  return await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      profilePath: usersTable.profilePath
    })
    .from(usersTable)
    .where(inArray(usersTable.id, friendIds));
}
