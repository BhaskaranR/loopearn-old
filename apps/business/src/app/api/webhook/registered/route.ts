import * as crypto from "node:crypto";
import { env } from "@/env.mjs";
import { logger } from "@/utils/logger";
import { resend } from "@/utils/resend";
import WelcomeEmail from "@loopearn/email/emails/welcome";
import { LogEvents } from "@loopearn/events/events";
import { setupAnalytics } from "@loopearn/events/server";
import { render } from "@react-email/render";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// NOTE: This is trigger from supabase database webhook
export async function POST(req: Request) {
  const text = await req.clone().text();
  const signature = headers().get("x-supabase-signature");

  if (!signature) {
    return NextResponse.json({ message: "Missing signature" }, { status: 401 });
  }

  const decodedSignature = Buffer.from(signature, "base64");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET!)
    .update(text)
    .digest();

  const hmacMatch = crypto.timingSafeEqual(
    decodedSignature,
    calculatedSignature,
  );

  if (!hmacMatch) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  const body = await req.json();

  const email = body.record.email;
  const userId = body.record.id;
  const fullName = body.record.raw_user_meta_data.full_name;

  const analytics = await setupAnalytics({
    userId,
    fullName,
  });

  analytics.track({
    event: LogEvents.Registered.name,
    channel: LogEvents.Registered.channel,
  });

  if (fullName) {
    try {
      const html = await render(WelcomeEmail({ fullName }));

      await resend.emails.send({
        to: email,
        subject: "Welcome to LoopEarn",
        from: "Randhir from LoopEarn <randhir@loopearn.com>",
        html,
        headers: {
          "X-Entity-Ref-ID": nanoid(),
        },
      });
    } catch (error) {
      logger(error as string);
    }
  }

  try {
    const [firstName, lastName] = fullName?.split(" ") ?? [];

    await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: env.RESEND_AUDIENCE_ID,
    });
  } catch (error) {
    logger(error as string);
  }

  return NextResponse.json({ success: true });
}
