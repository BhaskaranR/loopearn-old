import { type QueryData, QueryError, QueryResult } from "@supabase/supabase-js";
import { addDays, isWithinInterval } from "date-fns";
import type { Client } from "../types";

export async function getUserQuery(supabase: Client, userId: string) {
  const cols = `
    id,
    username,
    full_name,
    avatar_url,
    metadata,
    profile_status,
    referral_code,
    locale,
    phone,
    business_id,
    business_users!user_id(
      role,
      business:business_id(
        id,
        business_name,
        avatar_url
      )
    )
  `;
  const { data, error } = await supabase
    .from("users")
    .select(cols)
    .eq("id", userId)
    .single();

  console.log("Response:", { data, error });

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
      user:users(id, full_name, avatar_url, username)
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
  businessId: string;
  userId: string;
};

export async function getBusinessUserQuery(
  supabase: Client,
  params: GetBusinessUserParams,
) {
  const { data } = await supabase
    .from("business_users")
    .select(
      `
      id,
      role,
      business_id,
      user:users(id, full_name, avatar_url, username)
    `,
    )
    .eq("business_id", params.businessId)
    .eq("user_id", params.userId)
    .throwOnError()
    .single();

  return {
    data,
  };
}

export async function getTeamsByUserIdQuery(supabase: Client, userId: string) {
  return supabase
    .from("business_users")
    .select(
      `
      id,
      role,
      business:business_id(*)`,
    )
    .eq("user_id", userId)
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
