import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "../clients/server";
import {
  getBusinessByIdQuery,
  getBusinessBySlugQuery,
  getBusinessMembersQuery,
  getCampaignActionRewardsQuery,
  getCampaignsQuery,
  getCategoriesQuery,
  getPendingBusinessInvitesQueryForUser,
  getSubCategoriesQuery,
  getTeamsByUserIdQuery,
  getUserInvitesQuery,
  getUserQuery,
} from "../queries";

export const getSession = cache(async () => {
  const supabase = createClient();

  return supabase.auth.getUser();
});

export const getUser = async () => {
  const {
    data: { user },
  } = await getSession();
  const userId = user?.id;

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
      revalidate: 180,
    },
  )();
};

export const getBusinessBySlug = async (slug: string) => {
  const supabase = createClient();
  const user = await getUser();
  const userId = user?.id;

  if (!userId) {
    return;
  }

  return unstable_cache(
    async () => {
      return getBusinessBySlugQuery(supabase, slug);
    },
    ["business_by_slug", slug],
    {
      tags: [`business_by_slug_${slug}`],
      revalidate: 280,
    },
  )();
};

export const getBusinessById = async (businessId: string) => {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getBusinessByIdQuery(supabase, businessId);
    },
    ["business", businessId],
    {
      tags: [`teams_${businessId}`],
      revalidate: 280,
    },
  )();
};

export const getTeams = async () => {
  const supabase = createClient();

  const user = await getUser();
  const userId = user?.id;

  if (!userId) {
    return;
  }

  return unstable_cache(
    async () => {
      return getTeamsByUserIdQuery(supabase, userId);
    },
    ["teams", userId],
    {
      tags: [`teams_${userId}`],
      revalidate: 280,
    },
  )();
};

export const getPendingBusinessInvites = async () => {
  const supabase = createClient();
  const user = await getUser();
  const userId = user?.id;

  if (!userId) {
    return;
  }

  return unstable_cache(
    async () => {
      return getPendingBusinessInvitesQueryForUser(supabase, user!.username!);
    },
    ["pending_business_invites", user!.username!],
    {
      tags: [`pending_business_invites_${userId}`],
      revalidate: 280,
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
      revalidate: 280,
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
      revalidate: 280,
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
      revalidate: 280,
    },
  )();
};

export const getCategories = async () => {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getCategoriesQuery(supabase);
    },
    ["categories"],
    {
      tags: ["categories"],
      revalidate: 86400,
    },
  )();
};

export const getSubCategories = async (categoryId: string) => {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getSubCategoriesQuery(supabase, categoryId);
    },
    ["subcategories", categoryId],
    {
      tags: [`subcategories_${categoryId}`],
      revalidate: 86400,
    },
  )();
};

export const getCampaignsForBusiness = async () => {
  const supabase = createClient();
  const user = await getUser();
  const businessId = user?.business_id;

  if (!businessId) {
    return;
  }

  return unstable_cache(
    async () => {
      return getCampaignsQuery(supabase, businessId);
    },
    ["campaigns", businessId],
    {
      tags: [`campaigns_${businessId}`],
      revalidate: 180,
    },
  )();
};

export const getCampaignActionReward = async (id: string) => {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getCampaignActionRewardsQuery(supabase, id);
    },
    ["campaign_action_reward", id],
    {
      tags: [`campaign_action_reward_${id}`],
      revalidate: 180,
    },
  )();
};
