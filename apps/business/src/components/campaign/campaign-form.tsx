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
import { Separator } from "@loopearn/ui/separator";
import { useToast } from "@loopearn/ui/use-toast";
import { addDays, format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import React from "react";
import type { DateRange } from "react-day-picker";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DatePickerWithRange } from "./date-picker-range";

interface CampaignFormProps {
  template: CampaignTemplate;
  initialData?: CreateCampaignFormValues | UpdateCampaignFormValues;
  mode?: "create" | "edit";
  redirectTo?: string;
}

export default function CampaignForm({
  template,
  initialData,
  mode = "create",
  redirectTo,
}: CampaignFormProps) {
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
    if (redirectTo) {
      data.redirect_to = redirectTo;
    }
    if (mode === "edit") {
      await updateAction.execute(data as UpdateCampaignFormValues);
    } else {
      await createAction.execute(data as CreateCampaignFormValues);
    }
  }

  console.log(form.formState.errors);
  console.log(form.formState.isValid);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <div className="mt-6 space-y-4">
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Activation
            </FormLabel>
            <FormControl>
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
            </FormControl>
          </FormItem>

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
  );
}
