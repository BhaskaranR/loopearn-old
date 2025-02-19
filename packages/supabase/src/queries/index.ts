import type { Client } from "../types";

export async function getUserQuery(supabase: Client, userId: string) {
  const cols = `
      *,
      business_users!user_id(*),
      business:business_id(slug, business_name, avatar_url, payouts_enabled, stripe_connect_id, payouts_enabled)
    `;
  const { data, error } = await supabase
    .from("users")
    .select(cols)
    .eq("id", userId)
    .single();

  if (error) throw error;
  if (!data) throw new Error("User not found");

  return data;
}

export async function getCurrentUserBusinessQuery(supabase: Client) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }
  return getUserQuery(supabase, user.id);
}

export async function getBusinessMembersQuery(
  supabase: Client,
  businessId: string,
) {
  console.log("getBusinessMembersQuery", businessId);
  const { data, error } = await supabase
    .from("business_users")
    .select(
      `
      id,
      role,
      business_id,
      business:business_id(id, slug, business_name, avatar_url),
      user:users(id, full_name, avatar_url, username)
    `,
    )
    .eq("business_id", businessId);

  if (error) throw error;

  return {
    data,
  };
}

export async function getBusinessByIdQuery(
  supabase: Client,
  businessId: string,
) {
  return supabase
    .from("business")
    .select("*")
    .eq("id", businessId)
    .throwOnError()
    .single();
}

export async function getBusinessBySlugQuery(
  supabase: Client,
  userId: string,
  slug: string,
) {
  return supabase.from("business").select("*").eq("slug", slug).single();
}

export async function getTeamsByUserIdQuery(supabase: Client, userId: string) {
  return supabase
    .from("business")
    .select(`
      *,
      business_users!inner(id, role, business_id)
    `)
    .eq("business_users.user_id", userId)
    .throwOnError();
}

export async function getPendingBusinessInvitesQueryForUser(
  supabase: Client,
  email: string,
) {
  return supabase
    .from("user_invites")
    .select(
      "id, email, code, role, user:invited_by(*), business:business_id(*)",
    )
    .eq("email", email)
    .throwOnError();
}

export async function getBusinessInvitesQuery(
  supabase: Client,
  businessId: string,
) {
  return supabase
    .from("user_invites")
    .select(
      "id, email, code, role, user:invited_by(*), business:business_id(*)",
    )
    .eq("business_id", businessId)
    .throwOnError();
}

export async function getUserInvitesQuery(supabase: Client, email: string) {
  return supabase
    .from("user_invites")
    .select(
      "id, email, code, role, user:invited_by(*), business:business_id(*)",
    )
    .eq("email", email)
    .throwOnError();
}

type GetUserInviteQueryParams = {
  code: string;
  email?: string;
};

export async function getUserInviteQueryByCode(
  supabase: Client,
  params: GetUserInviteQueryParams,
) {
  return supabase
    .from("user_invites")
    .select(
      "*, user:invited_by(full_name, avatar_url), business:business_id(id, business_name, avatar_url) ",
    )
    .eq("code", params.code)
    .single();
}

export async function getUserInviteQuery(
  supabase: Client,
  params: GetUserInviteQueryParams,
) {
  return supabase
    .from("user_invites")
    .select("*")
    .eq("code", params.code)
    .eq("email", params.email!)
    .single();
}

export async function getCategoriesQuery(supabase: Client) {
  return supabase.from("categories").select("*");
}

export async function getSubCategoriesQuery(
  supabase: Client,
  categoryId: string,
) {
  return supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId);
}

export async function getCampaignsQuery(supabase: Client, businessId: string) {
  return supabase
    .from("campaigns")
    .select(`
      *,
      campaign_action_rewards(
        id,
        reward_type,
        reward_value,
        reward_unit,
        action_type,
        action_details,
        coupon_code,
        created_at
      )
    `)
    .eq("business_id", businessId)
    .throwOnError();
}

export async function getCampaignActionRewardsQuery(
  supabase: Client,
  id: string,
) {
  return supabase
    .from("campaign_action_rewards")
    .select("*")
    .eq("campaign_id", id);
}
