"use client";

import { createCampaignAction } from "@/actions/campaign-actions";
import {
  type CreateCampaignFormValues,
  createCampaignSchema,
} from "@/actions/schema";
import type { CampaignTemplate } from "@/utils/campaigns";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@loopearn/ui/button";
import { Calendar } from "@loopearn/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@loopearn/ui/card";
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
import { Popover, PopoverContent, PopoverTrigger } from "@loopearn/ui/popover";
import { RadioGroup, RadioGroupItem } from "@loopearn/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loopearn/ui/select";
import { useToast } from "@loopearn/ui/use-toast";
import { addDays, format } from "date-fns";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  Edit2,
  Loader2,
  Star,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import React from "react";
import type { DateRange } from "react-day-picker";
import { Controller, useForm } from "react-hook-form";
import { DatePickerWithRange } from "./date-picker-range";

type CampaignTriggerProps {
  template?: CampaignTemplate;
  defaultIcon?: string;
  defaultPlatform?: CampaignTemplate["platform"];
}

export default function CampaignTrigger({
  template,
  defaultIcon = "facebook",
  defaultPlatform = "facebook",
}: CampaignManagerProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    template?.start_date && template?.end_date
      ? {
          from: new Date(template.start_date),
          to: new Date(template.end_date),
        }
      : undefined,
  );

  const [activation, setActivation] = React.useState<
    "always-active" | "scheduled"
  >(
    !template?.start_date && !template?.end_date
      ? "always-active"
      : "scheduled",
  );

  const action = useAction(createCampaignAction, {
    onError: ({ error }) => {
      toast({
        duration: 3500,
        variant: "error",
        title: "Something went wrong please try again.",
      });
      console.error("Failed to create campaign", error);
    },
  });

  const form = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: template
      ? {
          name: template.defaultName,
          description: template.defaultDescription,
          ...template,
          start_date: template.start_date
            ? new Date(template.start_date).toISOString()
            : undefined,
          end_date: template.end_date
            ? new Date(template.end_date).toISOString()
            : undefined,
        }
      : {
          name: "",
          description: "",
          type: "Reward Campaign",
          is_repeatable: false,
          max_achievement: 1,
          min_tier: 1,
          visibility: "AlwaysVisible",
          status: "active",
          is_live_on_marketplace: false,
          audience: "all",
          trigger: {
            action_type: "share",
            social_link: "",
          },
          reward: {
            reward_type: "percentage_discount",
            reward_value: 0,
            reward_unit: "points",
            applies_to: "entire",
            uses_per_customer: 1,
          },
        },
  });

  async function onSubmit(data: CreateCampaignFormValues) {
    action.execute(data);
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Facebook Friend" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Share us on facebook to receive a special reward"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SignUp">Sign Up</SelectItem>
                          <SelectItem value="Reward Campaign">
                            Reward Campaign
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="trigger.action_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Action</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const action = template?.availableActions.find(
                            (a) => a.action_type === value,
                          );
                          if (action?.defaultReward) {
                            form.setValue("reward", {
                              ...form.getValues("reward"),
                              ...action.defaultReward,
                            });
                          }
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
                  name="trigger.social_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.facebook.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

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
