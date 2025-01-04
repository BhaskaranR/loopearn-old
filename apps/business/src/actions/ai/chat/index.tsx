"use server";

import { BotMessage, SpinnerMessage } from "@/components/chat/messages";
import { openai } from "@ai-sdk/openai";
import { client as RedisClient } from "@loopearn/kv/client";
import { getUser } from "@loopearn/supabase/cached-queries";
import { Ratelimit } from "@upstash/ratelimit";
import {
  createAI,
  type createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { getAssistantSettings, saveChat } from "../storage";
import type { AIState, Chat, ClientMessage, UIState } from "../types";

const ratelimit = new Ratelimit({
  limiter: Ratelimit.fixedWindow(10, "10s"),
  redis: RedisClient,
});

export async function submitUserMessage(
  content: string,
): Promise<ClientMessage> {
  "use server";
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  const aiState = getMutableAIState<typeof AI>();

  if (!success) {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: "assistant",
          content:
            "Not so fast, tiger. You've reached your message limit. Please wait a minute and try again.",
        },
      ],
    });

    return {
      id: nanoid(),
      role: "assistant",
      display: (
        <BotMessage content="Not so fast, tiger. You've reached your message limit. Please wait a minute and try again." />
      ),
    };
  }

  const user = await getUser();
  const teamId = user?.business_users?.at(0)?.business_id as string;

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  // const result = await streamUI({
  //   model: openai("gpt-4o-mini"),
  //   initial: <SpinnerMessage />,
  //   system: `\
  //   You are a helpful local business assistant in LoopEarn who can help users ask questions about their marketplaces, contracts, vault, spending find invoices and more.

  //   If the user just wants to find transactions, call \`getTransactions\` function.
  //   If the user just wants to find documents, invoices or receipts, call \`getDocuments\` function.

  //   Always try to call the functions with default values, otherwise ask the user to respond with parameters. Just show one example if you can't call the function.

  //   `,
  //   messages: [
  //     ...aiState.get().messages.map((message: any) => ({
  //       role: message.role,
  //       content: message.content,
  //       name: message.name,
  //       display: null,
  //     })),
  //   ],
  //   text: ({ content, done, delta }) => {
  //     if (!textStream) {
  //       textStream = createStreamableValue("");
  //       textNode = <BotMessage content={textStream.value} />;
  //     }

  //     if (done) {
  //       textStream.done();
  //       aiState.done({
  //         ...aiState.get(),
  //         messages: [
  //           ...aiState.get().messages,
  //           {
  //             id: nanoid(),
  //             role: "assistant",
  //             content,
  //           },
  //         ],
  //       });
  //     } else {
  //       textStream.update(delta);
  //     }

  //     return textNode;
  //   },
  //   tools: {},
  // });

  return {
    id: nanoid(),
    role: "assistant",
    display: <BotMessage content="Hello" />,
  };
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  onSetAIState: async ({ state, done }) => {
    "use server";

    const settings = await getAssistantSettings();
    const createdAt = new Date();
    const userId = state.user.id;

    const { chatId, messages } = state;

    const firstMessageContent = messages?.at(0)?.content ?? "";
    const title =
      typeof firstMessageContent === "string"
        ? firstMessageContent.substring(0, 100)
        : "";

    const chat: Chat = {
      id: chatId,
      title,
      userId,
      createdAt,
      messages,
    };

    if (done && settings?.enabled) {
      await saveChat(chat);
    }
  },
});
