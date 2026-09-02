import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable, friendsTable } from '../src/db/schema';

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  const [alice] = await db
    .insert(usersTable)
    .values({ username: 'alice' })
    .returning();
  const [bob] = await db
    .insert(usersTable)
    .values({ username: 'bob' })
    .returning();
  const [carol] = await db
    .insert(usersTable)
    .values({ username: 'carol' })
    .returning();

  await db.insert(friendsTable).values({ user1Id: alice.id, user2Id: bob.id });

  console.log('Seeded users:');
  console.log('  alice:', alice.id);
  console.log('  bob:', bob.id);
  console.log('  carol:', carol.id);
  console.log('alice and bob are friends. carol has no friends.');
}

main();
