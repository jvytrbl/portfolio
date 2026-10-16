import { sql } from "drizzle-orm";
import { NextResponse, connection } from "next/server";
import { getDb } from "@/db/client";

// Pinged weekly by GitHub Actions so the free Supabase project never pauses
// for inactivity.
export async function GET() {
  // Opt out of prerendering: this must hit the database on every request.
  await connection();
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { ok: true, db: "not-configured" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ ok: true, db: "up" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[health]", error);
    return NextResponse.json({ ok: false, db: "down" }, { status: 503 });
  }
}
