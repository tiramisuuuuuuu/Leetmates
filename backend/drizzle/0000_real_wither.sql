CREATE TABLE "friendRequests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "friendRequests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"senderId" uuid NOT NULL,
	"recipientId" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "friends" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "friends_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user1Id" uuid NOT NULL,
	"user2Id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"leetcodeId" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_recipientId_users_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_user1Id_users_id_fk" FOREIGN KEY ("user1Id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_user2Id_users_id_fk" FOREIGN KEY ("user2Id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "friends_user1Id_idx" ON "friends" USING btree ("user1Id");--> statement-breakpoint
CREATE INDEX "friends_user2Id_idx" ON "friends" USING btree ("user2Id");