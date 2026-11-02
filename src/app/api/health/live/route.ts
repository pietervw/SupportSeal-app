import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Container liveness for the Docker HEALTHCHECK. Never touches the database:
 * a probe every 30 s that runs `SELECT 1` keeps a scale-to-zero Postgres
 * (Neon) awake around the clock. Database reachability is reported by
 * `/api/health`, which external monitors can poll at a relaxed interval.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET?.trim()) {
    return NextResponse.json(
      { status: "misconfigured", auth: "BETTER_AUTH_SECRET is not set" },
      { status: 503 },
    );
  }
  return NextResponse.json({ status: "ok" });
}
