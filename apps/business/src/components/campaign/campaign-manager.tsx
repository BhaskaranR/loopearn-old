"use client";

import { createCampaignAction } from "@/actions/campaign-actions";
import {
  type CreateCampaignFormValues,
  createCampaignSchema,
} from "@/actions/schema";
import {
  type CampaignTemplate,
  getCampaignTemplate,
} from "@/components/campaign-templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@loopearn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@loopearn/ui/card";
import { cn } from "@loopearn/ui/cn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@loopearn/ui/form";
import {
  Calendar,
  Disc,
  Facebook,
  Instagram,
  Star,
  TikTok,
} from "@loopearn/ui/icons";
import { Input } from "@loopearn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loopearn/ui/select";
import { useToast } from "@loopearn/ui/use-toast";
import { ArrowLeft, Check, Edit2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";

const steps = [
  { title: "Details", description: "Campaign information" },
  { title: "Rules", description: "Set campaign rules" },
  { title: "Reward", description: "Configure rewards" },
];

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
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const action = useAction(createCampaignAction, {
    onError: () => {
      toast({
        duration: 3500,
        variant: "error",
        title: "Something went wrong please try again.",
      });
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

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  async function onSubmit(data: CreateCampaignFormValues) {
    try {
      await createCampaignAction(data);
      toast({
        title: "Campaign created successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to create campaign",
      });
    }
  }

  function applyTemplate(templateId: string) {
    const template = getCampaignTemplate(templateId);
    if (template) {
      form.reset({
        name: template.defaultName,
        description: template.defaultDescription,
        ...template,
      });
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
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
          <Button variant="ghost" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="outline">Save</Button>
          <Button>Set live</Button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted">
              <div
                className="absolute left-0 top-0 w-full bg-primary transition-all duration-300"
                style={{
                  height: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <div className="relative z-10 space-y-8">
              {steps.map((step, index) => (
                <div key={step.title} className="flex items-start">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors mr-4",
                      index <= currentStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground",
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      className={cn(
                        "p-0 h-auto font-medium text-left",
                        index === currentStep
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                      onClick={() => goToStep(index)}
                    >
                      {step.title}
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{steps[currentStep].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      {/* <FormField
                        control={form.control}
                        name="template"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Template</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                applyTemplate(value);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a template" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {campaignTemplates.map((template) => (
                                  <SelectItem
                                    key={template.id}
                                    value={template.id}
                                  >
                                    {template.defaultName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

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
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Triggers</h3>
                        <FormField
                          control={form.control}
                          name="trigger.action_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Social Action</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Find and apply default reward for this action
                                  const action =
                                    template?.availableActions.find(
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
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Reward Type</h3>
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
                                  <SelectItem value="currency">
                                    Currency
                                  </SelectItem>
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
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(currentStep - 1)}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={action.status === "executing"}
                  >
                    Create Campaign
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => goToStep(currentStep + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
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
      return <TikTok className={className} />;
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
