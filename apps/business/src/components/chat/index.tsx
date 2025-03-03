"use client";

import type { ClientMessage } from "@/actions/ai/types";
import { useEnterSubmit } from "@/hooks/use-enter-submit";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { useAssistantStore } from "@/store/assistant";
import {
  handleCampaignCreation,
  isCampaignRequest,
} from "@/utils/chat-handlers/campaign-handler";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { Textarea } from "@loopearn/ui/textarea";
import { useActions } from "ai/rsc";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { ChatEmpty } from "./chat-empty";
import { ChatExamples, DEFAULT_EXAMPLES } from "./chat-examples";
import { ChatFooter } from "./chat-footer";
import { ChatList } from "./chat-list";
import { UserMessage } from "./messages";

const CAMPAIGN_EXAMPLES = [
  "Create a Facebook campaign where users share our post for a 10% discount",
  "Set up an Instagram campaign with 500 points reward for following us",
  "Make a review campaign that gives users a $10 discount",
];

export function Chat({
  messages,
  submitMessage,
  user,
  onNewChat,
  input,
  setInput,
  showFeedback,
}) {
  const { submitUserMessage } = useActions();
  const { formRef, onKeyDown } = useEnterSubmit();
  const ref = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { message } = useAssistantStore();

  const onSubmit = async (input: string) => {
    const value = input.trim();

    if (value.length === 0) {
      return null;
    }

    setInput("");
    scrollToBottom();

    submitMessage((message: ClientMessage[]) => [
      ...message,
      {
        id: nanoid(),
        role: "user",
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    // Check if this is a campaign creation request
    if (isCampaignRequest(value)) {
      const responseMessage = await handleCampaignCreation(value);
      submitMessage((messages: ClientMessage[]) => [
        ...messages,
        responseMessage,
      ]);
      return;
    }

    // Handle other types of messages with the existing AI
    const responseMessage = await submitUserMessage(value);
    submitMessage((messages: ClientMessage[]) => [
      ...messages,
      responseMessage,
    ]);
  };

  useEffect(() => {
    if (!ref.current && message) {
      onNewChat();
      onSubmit(message);
      ref.current = true;
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [messages]);

  const { messagesRef, scrollRef, visibilityRef, scrollToBottom } =
    useScrollAnchor();

  const showExamples = messages.length === 0 && !input;

  return (
    <div className="relative">
      <ScrollArea className="todesktop:h-[335px] md:h-[335px]" ref={scrollRef}>
        <div ref={messagesRef}>
          {messages.length ? (
            <ChatList messages={messages} className="p-4 pb-8" />
          ) : (
            <ChatEmpty firstName={user?.full_name.split(" ").at(0)} />
          )}

          <div className="w-full h-px" ref={visibilityRef} />
        </div>
      </ScrollArea>

      <div className="fixed bottom-[1px] left-[1px] right-[1px] todesktop:h-[88px] md:h-[88px] bg-background border-border border-t-[1px]">
        {showExamples && (
          <ChatExamples
            onSubmit={onSubmit}
            examples={[...CAMPAIGN_EXAMPLES, ...DEFAULT_EXAMPLES]}
          />
        )}

        <form
          ref={formRef}
          onSubmit={(evt) => {
            evt.preventDefault();
            onSubmit(input);
          }}
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            rows={1}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            value={input}
            className="h-12 min-h-12 pt-3 resize-none border-none"
            placeholder="Ask LoopEarn a question or describe a campaign to create..."
            onKeyDown={onKeyDown}
            onChange={(evt) => {
              setInput(evt.target.value);
            }}
          />
        </form>

        <ChatFooter
          onSubmit={() => onSubmit(input)}
          showFeedback={showFeedback}
        />
      </div>
    </div>
  );
}
