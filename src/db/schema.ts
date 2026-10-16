import { index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const submissionStatus = pgEnum("submission_status", ["UNREAD", "READ", "ARCHIVED"]);

// RLS is enabled with no policies: the app connects as the database owner
// (which bypasses RLS), while Supabase's public REST API gets no access.
export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderName: text("sender_name").notNull(),
    senderEmail: text("sender_email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    ipHash: text("ip_hash").notNull(),
    status: submissionStatus("status").notNull().default("UNREAD"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("contact_submissions_ip_created_idx").on(t.ipHash, t.createdAt)],
).enableRLS();

export const projectViews = pgTable("project_views", {
  slug: text("slug").primaryKey(),
  views: integer("views").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
