import { createClient as createAdminClient } from "../clients/admin";
import {
  getCurrentUserBusinessQuery,
  getUserInviteQuery,
  getUserInviteQueryByCode,
} from "../queries";
import type { Client } from "../types";
import type { Tables, TablesInsert, TablesUpdate } from "../types/db";

export async function updateUser(supabase: Client, data: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  return supabase
    .from("users")
    .update(data)
    .eq("id", user.id)
    .select()
    .single();
}

export async function deleteUser(supabase: Client) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await Promise.all([
    supabase.auth.admin.deleteUser(user.id),
    supabase.from("users").delete().eq("id", user.id),
    supabase.auth.signOut(),
  ]);

  return user.id;
}

export async function updateBusiness(supabase: Client, data) {
  const userData = await getCurrentUserBusinessQuery(supabase);
  if (!userData?.business_id) {
    return;
  }

  return supabase
    .from("business")
    .update(data)
    .eq("id", userData?.business_id)
    .select("*")
    .single();
}

type UpdateUserTeamRoleParams = {
  role: "owner" | "member";
  userId: string;
  businessId: string;
};

export async function updateUserTeamRole(
  supabase: Client,
  params: UpdateUserTeamRoleParams,
) {
  const { role, userId, businessId } = params;

  return supabase
    .from("business_users")
    .update({
      role,
    })
    .eq("user_id", userId)
    .eq("business_id", businessId)
    .select()
    .single();
}

export async function deleteTeam(supabase: Client, businessId: string) {
  return supabase.from("business").delete().eq("id", businessId);
}

type DeleteTeamMemberParams = {
  userId: string;
  businessId: string;
};

export async function deleteTeamMember(
  supabase: Client,
  params: DeleteTeamMemberParams,
) {
  return supabase
    .from("business_users")
    .delete()
    .eq("user_id", params.userId)
    .eq("business_id", params.businessId)
    .select()
    .single();
}

type CreateBusinessParams = {
  name: string;
  slug: string;
  email: string;
};

export async function createBusiness(
  supabase: Client,
  params: CreateBusinessParams,
) {
  const { data, error } = await supabase.rpc("create_business", {
    business_name: params.name,
    slug: params.slug,
    business_email: params.email,
  });
  console.log(error);
  return data;
}

type LeaveBusinessParams = {
  userId: string;
  businessId: string;
};

export async function leaveBusiness(
  supabase: Client,
  params: LeaveBusinessParams,
) {
  return supabase
    .from("business_users")
    .delete()
    .eq("business_id", params.businessId)
    .eq("user_id", params.userId)
    .select()
    .single();
}

export async function joinTeamByInviteCode(supabase: Client, code: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return;
  }

  const { data: inviteData } = await getUserInviteQuery(supabase, {
    code,
    email: user.email,
  });

  if (inviteData) {
    // Add user team todo change this to use normal supabase
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from("business_users").insert({
      user_id: user.id,
      business_id: inviteData?.business_id,
      role: inviteData.role,
    });

    // Set current team
    const { data } = await supabase
      .from("users")
      .update({
        business_id: inviteData?.business_id,
      })
      .eq("id", user.id)
      .select()
      .single();

    // remove invite
    await supabase.from("user_invites").delete().eq("code", code);

    return data;
  }

  return null;
}

export async function canJoinTeamByInviteCode(supabase: Client, code: string) {
  const { data: inviteData } = await getUserInviteQueryByCode(supabase, {
    code,
  });

  return inviteData;
}

// Campaign Types
export interface CreateCampaignParams extends TablesInsert<"campaigns"> {
  reward: TablesInsert<"campaign_action_rewards">;
}

interface UpdateCampaignParams extends TablesUpdate<"campaigns"> {
  reward?: Partial<TablesUpdate<"campaign_action_rewards">>;
}

// Campaign Mutations
export async function createCampaign(
  supabase: Client,
  params: CreateCampaignParams,
): Promise<Tables<"campaigns"> | null> {
  const { reward, ...campaignData } = params;

  const { data, error } = await supabase.rpc("create_campaign", {
    campaign_data: campaignData,
    reward_data: reward,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateCampaign(
  supabase: Client,
  id: string,
  params: UpdateCampaignParams,
): Promise<Tables<"campaigns"> | null> {
  const { reward, ...campaignData } = params;

  const { data, error } = await supabase.rpc("update_campaign", {
    campaign_id: id,
    campaign_data: campaignData,
    reward_data: reward!,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCampaign(
  supabase: Client,
  id: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase.from("campaigns").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function createBusinessAddress(supabase: Client, data: any) {
  // delete existing address
  await supabase
    .from("business_address")
    .delete()
    .eq("business_id", data.business_id);

  return supabase.from("business_address").insert(data).select("*").single();
}
