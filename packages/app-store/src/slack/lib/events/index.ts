import { createSlackWebClient } from "@loopearn/app-store/slack";
import type { SlackEvent } from "@slack/bolt";
import { waitUntil } from "@vercel/functions";
import { assistantThreadMessage } from "./thread";

export async function handleSlackEvent(
  event: SlackEvent,
  options: { token: string; businessId: string },
) {
  const client = createSlackWebClient({
    token: options.token,
  });

  if (
    event.text &&
    event.type === "message" &&
    event.channel_type === "im" &&
    !event.bot_id && // Ignore bot messages
    event.subtype !== "assistant_app_thread"
  ) {
    waitUntil(assistantThreadMessage(event, client, options));
    return;
  }
}
