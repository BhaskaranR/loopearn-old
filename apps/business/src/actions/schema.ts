import { isValid } from "date-fns";
import { z } from "zod";

// sign up schema with first name, last name, company name, email & ein number
export const signUpSchema = z.object({
  firstName: z.string().min(2).max(32),
  lastName: z.string().min(2).max(32),
  // companyName: z.string().min(2).max(32).optional(),
  email: z.string().email(),
  // slug: z.string().optional(),
});

// sign up schema with first name, last name, company name, email & ein number
export const signInSchema = z.object({
  email: z.string().email(),
  inviteCode: z.string().optional(),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const updateUserSchema = z.object({
  full_name: z.string().min(2).max(32).optional(),
  avatar_url: z.string().url().optional(),
  locale: z.string().optional(),
  week_starts_on_monday: z.boolean().optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export const trackingConsentSchema = z.boolean();

export const sendSupportSchema = z.object({
  subject: z.string(),
  priority: z.string(),
  type: z.string(),
  message: z.string(),
  url: z.string().optional(),
});

export const updateBusinessSchema = z.object({
  name: z.string().min(2).max(32).optional(),
  email: z.string().email().optional(),
  logo_url: z.string().url().optional(),
  document_classification: z.boolean().optional(),
  revalidatePath: z.string().optional(),
});

export type UpdateBusinessFormValues = z.infer<typeof updateBusinessSchema>;

export const subscribeSchema = z.object({
  email: z.string().email(),
  userGroup: z.string(),
});

export const updateSubscriberPreferenceSchema = z.object({
  templateId: z.string(),
  teamId: z.string(),
  revalidatePath: z.string(),
  subscriberId: z.string(),
  type: z.string(),
  enabled: z.boolean(),
});

export const deleteTeamSchema = z.object({
  teamId: z.string(),
});

export const changeChartCurrencySchema = z.string();
export const changeChartTypeSchema = z.enum(["profit", "revenue", "burn_rate"]);
export const changeChartPeriodSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export const changeTransactionsPeriodSchema = z.enum([
  "all",
  "income",
  "expense",
]);

export const createAttachmentsSchema = z.array(
  z.object({
    path: z.array(z.string()),
    name: z.string(),
    size: z.number(),
    transaction_id: z.string(),
    type: z.string(),
  }),
);

export const deleteAttachmentSchema = z.object({
  id: z.string(),
});

export const exportTransactionsSchema = z.array(z.string());

export const deleteFileSchema = z.object({
  id: z.string(),
  path: z.array(z.string()),
});

export const deleteFolderSchema = z.object({
  path: z.array(z.string()),
});

export const createFolderSchema = z.object({
  path: z.string(),
  name: z.string(),
});

export const unenrollMfaSchema = z.object({
  factorId: z.string(),
});

export const mfaVerifySchema = z.object({
  factorId: z.string(),
  challengeId: z.string(),
  code: z.string(),
});

export const shareFileSchema = z.object({
  filepath: z.string(),
  expireIn: z.number(),
});

export const sendFeedbackSchema = z.object({
  feedback: z.string(),
});

export const deleteCategoriesSchema = z.object({
  ids: z.array(z.string()),
  revalidatePath: z.string(),
});

export const updaterMenuSchema = z.array(
  z.object({
    path: z.string(),
    name: z.string(),
  }),
);

export const changeBusinessSchema = z.object({
  businessId: z.string(),
  redirectTo: z.string(),
});

export const joinTeamSchema = z.object({
  code: z.string(),
});

export const createBusinessSchema = z.object({
  name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  slug: z.string().min(4, {
    message: "Slug must be at least 4 characters.",
  }),
  redirectTo: z.string().optional(),
});

export const changeUserRoleSchema = z.object({
  userId: z.string(),
  businessId: z.string(),
  role: z.enum(["owner", "member"]),
  revalidatePath: z.string().optional(),
});

export const deleteTeamMemberSchema = z.object({
  userId: z.string(),
  businessId: z.string(),
  revalidatePath: z.string().optional(),
});

export const leaveTeamSchema = z.object({
  businessId: z.string(),
  redirectTo: z.string().optional(),
  role: z.enum(["owner", "member"]),
  revalidatePath: z.string().optional(),
});

export const deleteBusinessSchema = z.object({
  businessId: z.string(),
});

export const inviteTeamMembersSchema = z.object({
  saveOnly: z.boolean().optional(),
  invites: z.array(
    z.object({
      email: z.string().email().optional(),
      role: z.enum(["owner", "member"]),
    }),
  ),
  redirectTo: z.string().optional(),
  revalidatePath: z.string().optional(),
});

export type InviteTeamMembersFormValues = z.infer<
  typeof inviteTeamMembersSchema
>;

export const deleteInviteSchema = z.object({
  id: z.string(),
  revalidatePath: z.string().optional(),
});

export const acceptInviteSchema = z.object({
  id: z.string(),
  revalidatePath: z.string().optional(),
});

export const declineInviteSchema = z.object({
  id: z.string(),
  revalidatePath: z.string().optional(),
});

export const inboxFilterSchema = z.enum(["done", "todo", "all"]);

export const createCompanySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  estimate: z.number().optional(),
  billable: z.boolean().optional().default(false),
  rate: z.number().min(1).optional(),
  currency: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(["in_progress", "completed"]).optional(),
});

//

export const updateCompanySchema = z.object({
  id: z.string().uuid(),
  slug: z.string().optional(),
  business_name: z.string().min(1).optional(),
  country: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  avatar_url: z.string().url().optional(),
  description: z.string().optional(),
  revalidatePath: z.string().optional(),
  redirectTo: z.string().optional(),
});

export const updateCompanyProfileSchema = z.object({
  id: z.string().uuid(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  contact_name: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  revalidatePath: z.string().optional(),
  redirectTo: z.string().optional(),
});

export const upgradePlanSchema = z.object({
  plan: z.string(),
  period: z.string(),
  baseUrl: z.string().url(),
  onboarding: z.boolean(),
});

export const deleteProjectSchema = z.object({
  id: z.string().uuid(),
});

export const deleteEntriesSchema = z.object({
  id: z.string().uuid(),
});

export const createReportSchema = z.object({
  baseUrl: z.string().url(),
  from: z.string(),
  to: z.string(),
  currency: z.string(),
  type: changeChartTypeSchema,
  expiresAt: z.string().datetime().optional(),
});

export const setupUserSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  team_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export const verifyOtpSchema = z.object({
  type: z.enum(["phone", "email"]),
  token: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  redirectTo: z.string().optional(),
});

export const searchSchema = z.object({
  query: z.string().min(1),
  type: z.enum(["inbox", "categories"]),
  limit: z.number().optional(),
});

export const inboxOrder = z.boolean();

export const assistantSettingsSchema = z.object({
  enabled: z.boolean().optional(),
});

export const requestAccessSchema = z.void();

export const parseDateSchema = z
  .string()
  .transform((v) => isValid(v))
  .refine((v) => !!v, { message: "Invalid date" });

export const filterTransactionsSchema = z.object({
  name: z.string().optional().describe("The name to search for"),
  start: parseDateSchema
    .optional()
    .describe("The start date when to retrieve from. Return ISO-8601 format."),
  end: parseDateSchema
    .optional()
    .describe(
      "The end date when to retrieve data from. If not provided, defaults to the current date. Return ISO-8601 format.",
    ),
  attachments: z
    .enum(["exclude", "include"])
    .optional()
    .describe(
      "Whether to include or exclude results with attachments or receipts.",
    ),
  categories: z
    .array(z.string())
    .optional()
    .describe("The categories to filter by"),
});

export const filterVaultSchema = z.object({
  name: z.string().optional().describe("The name to search for"),
  tags: z.array(z.string()).optional().describe("The tags to filter by"),
  start: parseDateSchema
    .optional()
    .describe("The start date when to retrieve from. Return ISO-8601 format."),
  end: parseDateSchema
    .optional()
    .describe(
      "The end date when to retrieve data from. If not provided, defaults to the current date. Return ISO-8601 format.",
    ),
  owners: z.array(z.string()).optional().describe("The owners to filter by"),
});

// Base campaign action schema
export const campaignActionSchema = z.object({
  id: z.string().uuid().optional(),
  action_type: z.string().optional(),
  action_details: z.string().optional(),
  platform: z.string().optional(),
  social_link: z.string().url().optional(),
  required_count: z.number().optional(),
  order_index: z.number().optional(),
  is_mandatory: z.boolean().optional(),
  icon_url: z.string().url().optional().or(z.literal("")).or(z.null()),
  redirection_button_link: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  redirection_button_text: z.string().nullable().optional(),
});

export const createCampaignActionSchema = campaignActionSchema.extend({
  campaign_id: z.string().uuid(),
});

// Base campaign reward schema
export const campaignRewardSchema = z.object({
  // icon_url: z.string().url().optional(),
  // redirection_button_text: z.string().optional(),
  // redirection_button_link: z.string().url().optional(),
  // prefix: z.boolean().optional(),
  reward_type: z.enum([
    "rank_points",
    "wallet_points",
    "wallet_multiplier",
    "coupon",
    "percentage_discount",
    "fixed_amount_discount",
    "free_product",
    "free_shipping",
  ]),
  reward_value: z.number().min(0),
  reward_unit: z.enum(["points", "%", "currency"]).default("points"),
  expires_after: z.number().optional().nullable(),
  minimum_purchase_amount: z.number().optional(),
  uses_per_customer: z.number().default(1),
});

export const createCampaignRewardSchema = campaignRewardSchema.extend({
  campaign_id: z.string().uuid(),
});

// First create the object schema
const baseCampaignSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Campaign description must be at least 2 characters.",
  }),
  type: z.enum(["SignUp", "Reward Campaign", "Other"]),
  is_repeatable: z.boolean().default(false),
  max_achievement: z.number().default(1),
  min_tier: z.number().default(1),
  visibility: z.enum(["AlwaysVisible", "NotVisible"]).default("AlwaysVisible"),
  status: z.enum(["active", "inactive"]).default("active"),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  is_live_on_marketplace: z.boolean().default(true),
  audience: z.enum(["all", "specific"]).default("all"),
  campaign_actions: z.array(campaignActionSchema).min(0),
  campaign_rewards: campaignRewardSchema.optional(),
  redirect_to: z.string().optional(),
});

// Create campaign schema with refinement
export const createCampaignSchema = baseCampaignSchema.refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) > new Date(data.start_date);
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["end_date"],
  },
);

// Update campaign schema with refinement
export const updateCampaignSchema = baseCampaignSchema
  .extend({
    id: z.string().uuid(),
  })
  .partial()
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) > new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  );

export type CampaignAction = z.infer<typeof campaignActionSchema>;
export type CampaignReward = z.infer<typeof campaignRewardSchema>;
export type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignFormValues = z.infer<typeof updateCampaignSchema>;
export type CreateCampaignActionFormValues = z.infer<
  typeof createCampaignActionSchema
>;
export type CreateCampaignRewardFormValues = z.infer<
  typeof createCampaignRewardSchema
>;

export const marketplaceProfileSchema = z.object({
  slug: z.string().optional(),
  profile_photos: z.array(z.string()).optional(),
  profile_videos: z.array(z.string()).optional(),
  profile_bio: z
    .string()
    .min(300, { message: "Description must be at least 300 characters" })
    .max(10000, { message: "Description cannot exceed 10000 characters" })
    .optional(),
  profile_website_url: z.string().url().optional(),
  description: z.record(z.any()).optional(), // JSONB can be any JSON object
  terms_conditions: z.record(z.any()).optional(),
  directions: z.record(z.any()).optional(),
  redemption_rules: z.record(z.any()).optional(),
  amenities: z.record(z.any()).optional(),
  marketplace_onboarding_step: z.string().optional(),
  created_at: z
    .string()
    .datetime()
    .default(() => new Date().toISOString()),
  updated_at: z
    .string()
    .datetime()
    .default(() => new Date().toISOString()),
  redirectTo: z.string().optional(),
});

export type MarketplaceProfileFormValues = z.infer<
  typeof marketplaceProfileSchema
>;

export const updateAddressSchema = z.object({
  business_id: z.string(),
  address_line_1: z.string(),
  address_line_2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
  slug: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  redirectTo: z.string().optional(),
  marketplace_onboarding_step: z.string().optional(),
});

export type UpdateAddressFormValues = z.infer<typeof updateAddressSchema>;

export const addMarketplaceAddressSchema = z.object({
  business_id: z.string(),
  address_line_1: z.string(),
  address_line_2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  revalidatePath: z.string().optional(),
  redirectTo: z.string().optional(),
  marketplace_onboarding_step: z.string().optional(),
});
