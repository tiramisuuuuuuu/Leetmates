CREATE TABLE "userReports" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "userReports_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reporterId" uuid NOT NULL,
	"reportedUserId" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userReports" ADD CONSTRAINT "userReports_reporterId_users_id_fk" FOREIGN KEY ("reporterId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userReports" ADD CONSTRAINT "userReports_reportedUserId_users_id_fk" FOREIGN KEY ("reportedUserId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "userReports_reporterId_idx" ON "userReports" USING btree ("reporterId");--> statement-breakpoint
CREATE INDEX "userReports_reportedUserId_idx" ON "userReports" USING btree ("reportedUserId");