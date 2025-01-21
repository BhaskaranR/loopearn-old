import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "../clients/server";
import {
  getBusinessByIdQuery,
  getBusinessBySlugQuery,
  getBusinessMembersQuery,
  getBusinessUserQuery,
  getCategoriesQuery,
  getSubCategoriesQuery,
  getTeamsByUserIdQuery,
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

  return getBusinessBySlugQuery(supabase, userId, slug);
};

export const getBusinessById = async (businessId: string) => {
  const supabase = createClient();
  return getBusinessByIdQuery(supabase, businessId);
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
      revalidate: 180,
    },
  )();
};

export const getBusinessUser = async (slug?: string) => {
  const supabase = createClient();
  const user = await getUser();
  const businessId = user?.business_id!;

  return unstable_cache(
    async () => {
      return getBusinessUserQuery(supabase, {
        userId: user!.id,
        businessId,
        slug,
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
