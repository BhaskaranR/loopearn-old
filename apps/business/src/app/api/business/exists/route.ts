import { env } from "@/env.mjs";
import { client as RedisClient } from "@loopearn/kv/client";
import { createClient as supaClient } from "@supabase/supabase-js";
import { Ratelimit } from "@upstash/ratelimit";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: RedisClient,
      limiter: Ratelimit.slidingWindow(500, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `loopearn_ratelimit_${ip}`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }
  const cols = "id, slug";
  const { data, error } = await getConnection()
    .from("business")
    .select(cols)
    .eq("slug", slug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (data) {
    return NextResponse.json({ exists: true });
  }
  return NextResponse.json({ exists: false });
}

const getConnection = () => {
  return supaClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "",
    env.SUPABASE_SERVICE_KEY || "",
  );
};
