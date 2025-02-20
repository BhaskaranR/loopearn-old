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
import {
  Calendar as CalendarIcon,
  Disc,
  Facebook,
  Instagram,
  Star,
  Tiktok,
} from "@loopearn/ui/icons";
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
import { Loader2 } from "lucide-react";
import { ArrowLeft, Check, Edit2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import React from "react";
import type { DateRange } from "react-day-picker";
import { Controller, useForm } from "react-hook-form";
import { DatePickerWithRange } from "./date-picker-range";

interface CampaignManagerProps {
  template?: CampaignTemplate;
  defaultIcon?: string;
  defaultPlatform?: CampaignTemplate["platform"];
}

export default function CampaignManager({
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
          start_date: new Date(),
          end_date: addDays(new Date(), 30),
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns/create"
            className="group flex items-center gap-1 p-3 pr-7 text-sm text-black/50 transition-colors enabled:hover:text-black/80"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <DynamicIcon
                name={defaultIcon}
                className="h-4 w-4 text-blue-600"
              />
            </div>
            <h1 className="text-xl font-semibold capitalize">
              {defaultPlatform}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="outline">Save</Button>
          <Button>Set live</Button>
        </div>
      </div>

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

          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="reward.reward_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a reward type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reward type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rank_points">
                            Rank Points
                          </SelectItem>
                          <SelectItem value="wallet_points">
                            Wallet Points
                          </SelectItem>
                          <SelectItem value="wallet_multiplier">
                            Wallet Multiplier
                          </SelectItem>
                          <SelectItem value="coupon">Coupon</SelectItem>
                          <SelectItem value="percentage_discount">
                            Percentage Discount
                          </SelectItem>
                          <SelectItem value="fixed_amount_discount">
                            Fixed Amount Discount
                          </SelectItem>
                          <SelectItem value="free_product">
                            Free Product
                          </SelectItem>
                          <SelectItem value="free_shipping">
                            Free Shipping
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reward.reward_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reward.reward_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward Unit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="points">Points</SelectItem>
                          <SelectItem value="%">Percentage</SelectItem>
                          <SelectItem value="currency">Currency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reward.uses_per_customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uses Per Customer</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup
                  defaultValue="scheduled"
                  onValueChange={(value) => {
                    setActivation(value as "always-active" | "scheduled");
                    if (value === "always-active") {
                      form.setValue("start_date", new Date().toISOString());
                      form.setValue(
                        "end_date",
                        addDays(new Date(), 30).toISOString(),
                      );
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="always-active" id="always-active" />
                    <label htmlFor="always-active" className="text-sm">
                      Always Active
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <label htmlFor="scheduled" className="text-sm">
                      Scheduled
                    </label>
                  </div>
                </RadioGroup>

                {activation === "scheduled" && (
                  <Controller
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <DatePickerWithRange
                          className="w-full"
                          value={{
                            from: new Date(field.value),
                            to: new Date(form.getValues("end_date")),
                          }}
                          onChange={(range) => {
                            setDateRange(range);
                            if (range?.from) {
                              form.setValue(
                                "start_date",
                                format(range.from, "yyyy-MM-dd"),
                              );
                            }
                            if (range?.to) {
                              form.setValue(
                                "end_date",
                                format(range.to, "yyyy-MM-dd"),
                              );
                            }
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
              Create Campaign
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
      return <Disc className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    default:
      return <Facebook className={className} />;
  }
}
