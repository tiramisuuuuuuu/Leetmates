import { drizzle } from 'drizzle-orm/node-postgres';
import {
  usersTable,
  friendsTable,
  friendRequestsTable,
} from '../src/db/schema';

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  const users = await db.select().from(usersTable);
  const friends = await db.select().from(friendsTable);
  const friendRequests = await db.select().from(friendRequestsTable);

  console.log('users:');
  console.table(users);

  console.log('friends:');
  console.table(friends);

  console.log('friendRequests:');
  console.table(friendRequests);
}

main();
