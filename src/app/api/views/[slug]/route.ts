import { NextResponse } from "next/server";
import { getProjectSlugs } from "@/lib/content";
import { getViews, incrementViews } from "@/lib/views/store";

type Handler = (slug: string) => Promise<number | null>;

// Only known project slugs are counted, so arbitrary rows can't be created.
async function respond(params: Promise<{ slug: string }>, handler: Handler) {
  const { slug } = await params;
  if (!getProjectSlugs().includes(slug)) {
    return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  }
  try {
    const views = await handler(slug);
    if (views === null) {
      return NextResponse.json({ error: "View counter not configured" }, { status: 503 });
    }
    return NextResponse.json({ views }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[views]", error);
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}

export async function GET(_req: Request, ctx: RouteContext<"/api/views/[slug]">) {
  return respond(ctx.params, getViews);
}

export async function POST(_req: Request, ctx: RouteContext<"/api/views/[slug]">) {
  return respond(ctx.params, incrementViews);
}
