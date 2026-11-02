import { afterEach, describe, expect, it, vi } from "vitest";

const queryRaw = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { $queryRaw: (...args: unknown[]) => queryRaw(...args) } }));

import { GET } from "@/app/api/health/live/route";

describe("GET /api/health/live", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    queryRaw.mockReset();
  });

  it("is ok without querying the database", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BETTER_AUTH_SECRET", "s3cret");

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it("is unhealthy in production without BETTER_AUTH_SECRET", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BETTER_AUTH_SECRET", " ");

    const res = await GET();

    expect(res.status).toBe(503);
    expect(queryRaw).not.toHaveBeenCalled();
  });
});
