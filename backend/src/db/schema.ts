import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
  'users',
  {
    id: uuid().primaryKey(),
    username: varchar({ length: 255 }).notNull(),
    leetcodeId: varchar({ length: 255 }).notNull(),
    countryCode: varchar({ length: 2 }),
    currentStatus: text(),
    matchingPreference: text().default('everyone'),
    profilePath: text(),
    friendCode: text(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  (table) => [unique('users_friend_code_unique').on(table.friendCode)]
);

export const friendsTable = pgTable(
  'friends',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user1Id: uuid()
      .notNull()
      .references(() => usersTable.id),
    user2Id: uuid()
      .notNull()
      .references(() => usersTable.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('friends_user1Id_idx').on(table.user1Id),
    index('friends_user2Id_idx').on(table.user2Id),
  ]
);

export const friendRequestsTable = pgTable('friendRequests', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  senderId: uuid()
    .notNull()
    .references(() => usersTable.id),
  recipientId: uuid()
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pushSubscriptionsTable = pgTable('pushSubscriptions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id),
  endpoint: text().notNull().unique(),
  subscription: jsonb().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
