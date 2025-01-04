import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "../clients/server";
import {
  getBusinessMembersQuery,
  getBusinessUserQuery,
  getUserInvitesQuery,
  getUserQuery,
} from "../queries";

export const getSession = cache(async () => {
  const supabase = createClient();

  return supabase.auth.getSession();
});

export const getUser = async () => {
  const {
    data: { session },
  } = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getUserQuery(supabase, userId);
    },
    ["user", userId],
    {
      tags: [`user_${userId}`],
      revalidate: 1,
    },
  )();
};

export const getBusinessUser = async () => {
  const supabase = createClient();
  const user = await getUser();
  const businessId = user?.business_id!;

  return unstable_cache(
    async () => {
      return getBusinessUserQuery(supabase, {
        userId: user!.id,
        businessId,
      });
    },
    ["business", "user", user!.id],
    {
      tags: [`business_user_${user!.id}`],
      revalidate: 180,
    },
  )();
};

export const getBusinessMembers = async () => {
  const supabase = createClient();

  const user = await getUser();
  const businessId = user?.business_id;

  if (!businessId) {
    return null;
  }

  return unstable_cache(
    async () => {
      return getBusinessMembersQuery(supabase, businessId);
    },
    ["business_members", businessId],
    {
      tags: [`business_members_${businessId}`],
      revalidate: 180,
    },
  )();
};

export const getTeamInvites = async () => {
  const supabase = createClient();

  const user = await getUser();
  const teamId = user?.business_id;

  if (!teamId) {
    return;
  }

  return unstable_cache(
    async () => {
      return getUserInvitesQuery(supabase, teamId);
    },
    ["team", "invites", teamId],
    {
      tags: [`team_invites_${teamId}`],
      revalidate: 180,
    },
  )();
};

export const getUserInvites = async () => {
  const supabase = createClient();

  const user = await getUser();
  const email = user?.username!;

  return unstable_cache(
    async () => {
      return getUserInvitesQuery(supabase, email);
    },
    ["user", "invites", email],
    {
      tags: [`user_invites_${email}`],
      revalidate: 180,
    },
  )();
};
