import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),

  isOnline: boolean().default(false),
  lastOnlineAt: timestamp('last_online_at', { withTimezone: true }),
});

export const friendsTable = pgTable("friends", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user1Id: integer().notNull(),
  user2Id: integer().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const friendRequestsTable = pgTable("friendRequests", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  senderId: integer().notNull(),
  recipientId: integer().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
