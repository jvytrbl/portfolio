// @vitest-environment node
// Runs the real Drizzle queries against Postgres. Skipped unless
// TEST_DATABASE_URL points at a migrated database (CI provides one).
import { sql } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("database integration", () => {
  let db: NonNullable<ReturnType<typeof import("@/db/client").getDb>>;
  let deps: ReturnType<typeof import("@/lib/contact/integrations").createContactDeps>;
  let views: typeof import("@/lib/views/store");

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    db = (await import("@/db/client")).getDb()!;
    deps = (await import("@/lib/contact/integrations")).createContactDeps(true);
    views = await import("@/lib/views/store");
  });

  beforeEach(async () => {
    await db.execute(sql`truncate contact_submissions, project_views`);
  });

  it("saves submissions and counts them per IP and globally", async () => {
    const since = new Date(Date.now() - 60_000);
    const base = { name: "Ada", email: "ada@example.com", subject: "Hi", message: "Hello there!" };

    await deps.saveSubmission({ ...base, ipHash: "ip-a" });
    await deps.saveSubmission({ ...base, ipHash: "ip-a" });
    await deps.saveSubmission({ ...base, ipHash: "ip-b" });

    expect(await deps.countSubmissions({ ipHash: "ip-a", since })).toBe(2);
    expect(await deps.countSubmissions({ ipHash: "ip-b", since })).toBe(1);
    expect(await deps.countSubmissions({ since })).toBe(3);
    expect(await deps.countSubmissions({ since: new Date(Date.now() + 60_000) })).toBe(0);

    const rows = await db.execute<{ status: string }>(sql`select status from contact_submissions`);
    expect(rows.map((r) => r.status)).toEqual(["UNREAD", "UNREAD", "UNREAD"]);
  });

  it("increments views atomically under concurrency", async () => {
    expect(await views.getViews("demo")).toBe(0);
    await Promise.all(Array.from({ length: 10 }, () => views.incrementViews("demo")));
    expect(await views.getViews("demo")).toBe(10);
    expect(await views.incrementViews("demo")).toBe(11);
  });
});
