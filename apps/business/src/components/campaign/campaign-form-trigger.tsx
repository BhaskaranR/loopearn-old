"use client";

import { createCampaignTrigger } from "@/actions/campaign-actions";
import {
  type CreateCampaignActionFormValues,
  createCampaignActionSchema,
} from "@/actions/schema";
import type { CampaignTemplate } from "@/utils/campaigns";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@loopearn/ui/button";
import { Calendar } from "@loopearn/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@loopearn/ui/form";
import { Gamepad2 } from "lucide-react";

import { Facebook, Tiktok } from "@loopearn/ui/icons";
import { Instagram } from "@loopearn/ui/icons";
import { Input } from "@loopearn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loopearn/ui/select";
import { Calendar as CalendarIcon, Loader2, Star } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { useForm } from "react-hook-form";

type CampaignTriggerProps = {
  template: CampaignTemplate;
  initialData?: CreateCampaignActionFormValues;
};

export default function CampaignFormTrigger({
  template,
  initialData,
}: CampaignTriggerProps) {
  const action = useAction(createCampaignTrigger);

  const form = useForm<CreateCampaignActionFormValues>({
    resolver: zodResolver(createCampaignActionSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: CreateCampaignActionFormValues) {
    action.execute(data);
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="action_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Action</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const action = template?.availableActions.find(
                        (a) => a.action_type === value,
                      );
                      // set it to form action type
                      form.setValue("action_type", value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {template?.availableActions.map((action) => (
                        <SelectItem
                          key={action.action_type}
                          value={action.action_type}
                        >
                          {action.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.facebook.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={action.status === "executing"}
              className="flex items-center gap-2"
            >
              {action.status === "executing" && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Save Action
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function DynamicIcon({
  name,
  className,
}: { name: string; className?: string }) {
  switch (name) {
    case "facebook":
      return <Facebook className={className} />;
    case "instagram":
      return <Instagram className={className} />;
    case "tiktok":
      return <Tiktok className={className} />;
    case "star":
      return <Star className={className} />;
    case "wheel":
      return <Gamepad2 className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    default:
      return <Facebook className={className} />;
  }
}
