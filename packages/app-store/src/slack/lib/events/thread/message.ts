import { openai } from "@ai-sdk/openai";
import { createClient } from "@loopearn/supabase/server";
import type { AssistantThreadStartedEvent, WebClient } from "@slack/web-api";
import { generateText } from "ai";
import { startOfMonth, subMonths } from "date-fns";

const defaultValues = {
  from: subMonths(startOfMonth(new Date()), 12).toISOString(),
  to: new Date().toISOString(),
};

export async function assistantThreadMessage(
  event: AssistantThreadStartedEvent,
  client: WebClient,
  { teamId }: { teamId: string },
) {
  const supabase = createClient({ admin: true });
}
