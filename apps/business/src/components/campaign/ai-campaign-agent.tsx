"use client";

import { createCampaignAction } from "@/actions/campaign-actions";
import { processCampaignMessage } from "@/utils/campaign-processor";
import { Button } from "@loopearn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@loopearn/ui/card";
import { Input } from "@loopearn/ui/input";
import { useToast } from "@loopearn/ui/use-toast";
import { Loader2, Send } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

export function AICampaignAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        'Hi! I can help you create marketing campaigns. Just describe what kind of campaign you want to create. For example:\n\n"Create a Facebook campaign where users share our post for a 10% discount" or "Set up an Instagram campaign with 500 points reward for following us"',
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const action = useAction(createCampaignAction, {
    onSuccess: () => {
      toast({
        title: "Campaign created successfully!",
        duration: 3000,
      });
    },
    onError: ({ error }) => {
      const errorMessage =
        error.serverError ||
        error.validationErrors?.formErrors?.[0] ||
        "Failed to create campaign";

      toast({
        variant: "error",
        title: "Failed to create campaign",
        description: errorMessage,
        duration: 3000,
      });
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Process the user's message and create campaign configuration
      const campaignConfig = await processCampaignMessage(userMessage);

      // Create the campaign
      await action.execute(campaignConfig);

      // Add success message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've created a campaign with the following details:
• Name: ${campaignConfig.name}
• Type: ${campaignConfig.type}
• Action: ${campaignConfig.campaign_actions[0].action_type}
• Reward: ${campaignConfig.campaign_rewards.reward_value} ${campaignConfig.campaign_rewards.reward_unit} ${campaignConfig.campaign_rewards.reward_type}
${campaignConfig.start_date ? `• Duration: ${new Date(campaignConfig.start_date).toLocaleDateString()} to ${new Date(campaignConfig.end_date || "").toLocaleDateString()}` : "• Always active"}`,
        },
      ]);
    } catch (error) {
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I couldn't create the campaign. Please try again with more specific details.",
          isError: true,
        },
      ]);
    }

    setIsLoading(false);
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Campaign Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-slate-50 rounded-lg">
              {messages.map((message, i) => (
                <div
                  key={`msg-${i}-${message.content.substring(0, 10)}`}
                  className={`flex ${
                    message.role === "assistant"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "assistant"
                        ? message.isError
                          ? "bg-red-50 text-red-800"
                          : "bg-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the campaign you want to create..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
