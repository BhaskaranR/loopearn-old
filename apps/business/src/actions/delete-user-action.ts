"use server";

import { resend } from "@/utils/resend";
import { LogEvents } from "@loopearn/events/events";
import { setupAnalytics } from "@loopearn/events/server";
import { getUser } from "@loopearn/supabase/cached-queries";
import { deleteUser } from "@loopearn/supabase/mutations";
import { createClient } from "@loopearn/supabase/server";
import { redirect } from "next/navigation";

export const deleteUserAction = async () => {
  const supabase = createClient();
  const user = await getUser();

  const { data: membersData } = await supabase
    .from("business_users")
    .select("business_id, business:business_id(id, business_name, avatar_url)")
    .eq("user_id", user?.data?.id!);

  const businessIds = membersData
    ?.filter(({ business }) => business.length === 1)
    .map(({ business_id }) => business_id);

  if (businessIds?.length) {
    // Delete all teams with only one member
    await supabase.from("business").delete().in("id", businessIds);
  }

  const userId = await deleteUser(supabase);

  await resend.contacts.remove({
    email: user?.data?.username!,
    audienceId: process.env.RESEND_AUDIENCE_ID!,
  });

  const analytics = await setupAnalytics({
    userId,
  });

  analytics.track({
    event: LogEvents.DeleteUser.name,
    user_id: userId,
    channel: LogEvents.DeleteUser.channel,
  });

  redirect("/");
};
