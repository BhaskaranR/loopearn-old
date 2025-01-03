import { env } from "@/env.mjs";
import { client as RedisClient } from "@loopearn/kv";
import { createClient as supaClient } from "@supabase/supabase-js";
import { Ratelimit } from "@upstash/ratelimit";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: RedisClient,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `relistex_ratelimit_${ip}`,
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

  const cols =
    "id, business_users(role, business_id , business!inner(id, industry))";

  const { data, error } = await getConnection()
    .from("users")
    .select(cols)
    .eq("username", email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userData = data as any;
  if (
    userData &&
    userData.length > 0 &&
    userData[0]?.business_users &&
    Array.isArray(userData[0].business_users)
  ) {
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
