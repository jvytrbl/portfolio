CREATE TYPE "public"."submission_status" AS ENUM('UNREAD', 'READ', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_name" text NOT NULL,
	"sender_email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"ip_hash" text NOT NULL,
	"status" "submission_status" DEFAULT 'UNREAD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_submissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_views" (
	"slug" text PRIMARY KEY NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "contact_submissions_ip_created_idx" ON "contact_submissions" USING btree ("ip_hash","created_at");