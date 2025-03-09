"use client";

import {
  createCampaignAction,
  updateCampaignAction,
} from "@/actions/campaign-actions";
import {
  type CreateCampaignFormValues,
  type UpdateCampaignFormValues,
  createCampaignSchema,
  updateCampaignSchema,
} from "@/actions/schema";
import type { CampaignTemplate } from "@/utils/campaigns";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Database } from "@loopearn/supabase/db";
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
import { Facebook, Instagram, Tiktok } from "@loopearn/ui/icons";
import { Input } from "@loopearn/ui/input";
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
import { ArrowLeft } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import type { DateRange } from "react-day-picker";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DatePickerWithRange } from "./date-picker-range";

interface CampaignManagerProps {
  template: CampaignTemplate;
  initialData?: CreateCampaignFormValues | UpdateCampaignFormValues;
  mode?: "create" | "edit";
}

export default function CampaignManager({
  template,
  initialData,
  mode = "create",
}: CampaignManagerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialData?.start_date && initialData?.end_date
      ? {
          from: new Date(initialData.start_date),
          to: new Date(initialData.end_date),
        }
      : undefined,
  );

  const [activation, setActivation] = React.useState<
    "always-active" | "scheduled"
  >(
    !initialData?.start_date && !initialData?.end_date
      ? "always-active"
      : "scheduled",
  );

  const createAction = useAction(createCampaignAction, {
    onSuccess: () => {
      toast({
        title: "Campaign created successfully",
        duration: 3500,
      });
      router.push("/campaigns");
    },
    onError: ({ error }) => {
      toast({
        duration: 3500,
        variant: "error",
        title: "Something went wrong please try again.",
      });
      console.error("Failed to create campaign", error);
    },
  });

  const updateAction = useAction(updateCampaignAction, {
    onSuccess: () => {
      toast({
        title: "Campaign updated successfully",
        duration: 3500,
      });
      router.push("/campaigns");
    },
    onError: ({ error }) => {
      toast({
        duration: 3500,
        variant: "error",
        title: "Something went wrong please try again.",
      });
      console.error("Failed to update campaign", error);
    },
  });

  const form = useForm<CreateCampaignFormValues | UpdateCampaignFormValues>({
    resolver: zodResolver(
      mode === "create" ? createCampaignSchema : updateCampaignSchema,
    ),
    defaultValues: initialData,
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "campaign_actions",
  });

  async function onSubmit(
    data: CreateCampaignFormValues | UpdateCampaignFormValues,
  ) {
    if (mode === "edit") {
      await updateAction.execute(data as UpdateCampaignFormValues);
    } else {
      await createAction.execute(data as CreateCampaignFormValues);
    }
  }

  console.log(form.formState.errors);
  console.log(form.formState.isValid);

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns"
            className="group flex items-center gap-1 p-3 pr-7 text-sm text-black/50 transition-colors enabled:hover:text-black/80"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <DynamicIcon
                name={template.icon}
                className="h-4 w-4 text-blue-600"
              />
            </div>
            <h1 className="text-xl font-semibold capitalize">
              {template.platform}
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
                  name={`campaign_actions.${0}.action_type`}
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
                            form.setValue("campaign_rewards", {
                              ...form.getValues("campaign_rewards"),
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
                  name={`campaign_actions.${0}.social_link`}
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
                  name="campaign_rewards.reward_type"
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
                  name="campaign_rewards.reward_value"
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
                  name="campaign_rewards.reward_unit"
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
                  name="campaign_rewards.uses_per_customer"
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

                <FormField
                  control={form.control}
                  name="campaign_rewards.expires_after"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward Expiration</FormLabel>
                      <div className="space-y-4">
                        <RadioGroup
                          defaultValue={
                            field.value === null ? "never" : "timed"
                          }
                          onValueChange={(value) => {
                            if (value === "never") {
                              field.onChange(null);
                            } else {
                              field.onChange(field.value || 1);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="never" id="never" />
                            <label htmlFor="never" className="text-sm">
                              Never Expires
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="timed" id="timed" />
                            <label htmlFor="timed" className="text-sm">
                              Expires After
                            </label>
                          </div>
                        </RadioGroup>

                        {field.value !== null && (
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                className="w-24"
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                min={1}
                              />
                            </FormControl>
                            <span className="text-sm">months</span>
                          </div>
                        )}
                      </div>
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
                  defaultValue={activation}
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
                    render={({ field }) => {
                      const startDate = field.value
                        ? new Date(field.value)
                        : new Date();
                      const endDate = form.getValues("end_date")
                        ? new Date(form.getValues("end_date"))
                        : addDays(startDate, 30);

                      return (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <DatePickerWithRange
                            className="w-full"
                            value={{
                              from: startDate,
                              to: endDate,
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
                      );
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={
                mode === "create"
                  ? createAction.status === "executing"
                  : updateAction.status === "executing"
              }
              className="flex items-center gap-2"
            >
              {(mode === "create"
                ? createAction.status === "executing"
                : updateAction.status === "executing") && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {mode === "create" ? "Create Campaign" : "Update Campaign"}
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
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "facebook":
      return <Facebook className={className} />;
    case "instagram":
      return <Instagram className={className} />;
    case "tiktok":
      return <Tiktok className={className} />;
    default:
      return <Facebook className={className} />;
  }
}
