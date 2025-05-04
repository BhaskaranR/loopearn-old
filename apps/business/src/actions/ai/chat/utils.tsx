import { BotMessage, UserMessage } from "@/components/chat/messages";
import type { Chat } from "../types";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function getUIComponentFromMessage(message) {
  if (message.role === "user") {
    return <UserMessage>{message.content}</UserMessage>;
  }

  if (message.role === "assistant" && typeof message.content === "string") {
    return <BotMessage content={message.content} />;
  }
}

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState?.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${aiState.id}-${index}`,
      display: getUIComponentFromMessage(message),
    }));
};
