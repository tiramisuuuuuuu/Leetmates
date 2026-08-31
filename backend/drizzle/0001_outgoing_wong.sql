ALTER TABLE "users" ADD COLUMN "isOnline" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_online_at" timestamp with time zone;