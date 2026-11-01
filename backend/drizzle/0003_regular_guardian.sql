CREATE TABLE "pushLogs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pushLogs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"senderId" uuid NOT NULL,
	"recipientId" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pushLogs" ADD CONSTRAINT "pushLogs_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushLogs" ADD CONSTRAINT "pushLogs_recipientId_users_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;