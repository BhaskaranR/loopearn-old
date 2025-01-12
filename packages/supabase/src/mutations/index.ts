import { getCurrentUserBusinessQuery, getUserInviteQuery } from "../queries";
import type { Client } from "../types";

export async function updateUser(supabase: Client, data: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return;
  }

  return supabase
    .from("users")
    .update(data)
    .eq("id", session.user.id)
    .select()
    .single();
}

export async function deleteUser(supabase: Client) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return;
  }

  await Promise.all([
    supabase.auth.admin.deleteUser(session.user.id),
    supabase.from("users").delete().eq("id", session.user.id),
    supabase.auth.signOut(),
  ]);

  return session.user.id;
}

export async function updateBusiness(supabase: Client, data) {
  const userData = await getCurrentUserBusinessQuery(supabase);
  if (!userData?.data?.business_id) {
    return;
  }

  return supabase
    .from("business")
    .update(data)
    .eq("id", userData?.data?.business_id)
    .select()
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
};

export async function createBusiness(
  supabase: Client,
  params: CreateBusinessParams,
) {
  const { data, error } = await supabase.rpc("create_business", {
    business_name: params.name,
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
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.email) {
    return;
  }

  const { data: inviteData } = await getUserInviteQuery(supabase, {
    code,
    email: session.user.email,
  });

  if (inviteData) {
    // Add user team
    await supabase.from("business_users").insert({
      user_id: session.user.id,
      business_id: inviteData?.business_id,
      role: inviteData.role,
    });

    // Set current team
    const { data } = await supabase
      .from("users")
      .update({
        business_id: inviteData?.business_id,
      })
      .eq("id", session.user.id)
      .select()
      .single();

    // remove invite
    await supabase.from("user_invites").delete().eq("code", code);

    return data;
  }

  return null;
}
