import {
  config,
  handleSlackEvent,
  verifySlackRequest,
} from "@loopearn/app-store/slack";
import { createClient } from "@loopearn/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const { challenge, business_id, event } = JSON.parse(rawBody);

  if (challenge) {
    return new NextResponse(challenge);
  }

  try {
    verifySlackRequest({
      signingSecret: process.env.SLACK_SIGNING_SECRET!,
      body: rawBody,
      // @ts-expect-error - headers are not typed
      headers: Object.fromEntries(headers().entries()),
    });
  } catch (error) {
    console.error("Slack request verification failed:", error);
    return NextResponse.json(
      { error: "Invalid Slack request" },
      { status: 401 },
    );
  }

  // We don't need to handle message_deleted events
  if (event?.type === "message_deleted") {
    return NextResponse.json({
      success: true,
    });
  }

  const supabase = createClient({ admin: true });

  const { data } = await supabase
    .from("apps")
    .select("business_id, config")
    .eq("app_id", config.id)
    .eq("config->>business_id", business_id)
    .single();

  if (!data) {
    return NextResponse.json(
      { error: "Unauthorized: No matching team found" },
      { status: 401 },
    );
  }

  if (event) {
    await handleSlackEvent(event, {
      token: data?.config.access_token!,
      businessId: data.business_id,
    });
  }

  return NextResponse.json({
    success: true,
  });
}
