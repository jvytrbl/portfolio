import "server-only";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { projectViews } from "@/db/schema";

/** Atomically increments and returns the new count (null = DB not configured). */
export async function incrementViews(slug: string): Promise<number | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .insert(projectViews)
    .values({ slug, views: 1 })
    .onConflictDoUpdate({
      target: projectViews.slug,
      set: { views: sql`${projectViews.views} + 1`, updatedAt: sql`now()` },
    })
    .returning({ views: projectViews.views });
  return row?.views ?? null;
}

export async function getViews(slug: string): Promise<number | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .select({ views: projectViews.views })
    .from(projectViews)
    .where(eq(projectViews.slug, slug));
  return row?.views ?? 0;
}
