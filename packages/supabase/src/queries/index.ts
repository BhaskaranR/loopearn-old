import type { Client } from "../types";

export async function getUserQuery(supabase: Client, userId: string) {
  const cols = `
      *,
      business_users!user_id(*),
      business:business_id(slug, payouts_enabled, stripe_connect_id, payouts_enabled)
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
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return;
  }
  return getUserQuery(supabase, session.user?.id);
}

export async function getBusinessMembersQuery(
  supabase: Client,
  businessId: string,
) {
  const { data } = await supabase
    .from("business_users")
    .select(
      `
      id,
      role,
      business_id,
      user:users(id, full_name, avatar_url, username),
    `,
    )
    .eq("business_id", businessId)
    .order("created_at")
    .throwOnError();

  return {
    data,
  };
}

type GetBusinessUserParams = {
  businessId?: string;
  slug?: string;
  userId: string;
};

export async function getBusinessUserQuery(
  supabase: Client,
  params: GetBusinessUserParams,
) {
  const query = supabase
    .from("business_users")
    .select(
      `
      id,
      role,
      business_id,
      business:business_id(id, slug, business_name, category, tags),
      user:users(id, full_name, avatar_url, username)
    `,
    )
    .eq("user_id", params.userId);

  if (params.slug) {
    query.eq("business.slug", params.slug);
  } else if (params.businessId) {
    query.eq("business_id", params.businessId);
  }

  const { data } = await query.throwOnError().single();

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
  return supabase
    .from("business")
    .select("*")
    .eq("slug", slug)
    .throwOnError()
    .single();
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
  email: string;
};

export async function getUserInviteQuery(
  supabase: Client,
  params: GetUserInviteQueryParams,
) {
  return supabase
    .from("user_invites")
    .select("*")
    .eq("code", params.code)
    .eq("email", params.email)
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
