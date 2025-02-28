import { AI } from "@/actions/ai/chat";
import { getOnboardingStep } from "@/utils/get-onboarding-step";
import { setupAnalytics } from "@loopearn/events/server";
import {
  getPendingBusinessInvites,
  getTeams,
  getUser,
} from "@loopearn/supabase/cached-queries";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const teams = await getTeams();

  const pendingInvites = await getPendingBusinessInvites();
  if (teams?.data?.length === 0 && pendingInvites?.data?.length === 0) {
    redirect("/onboarding/welcome");
  }
  if (user?.business_id) {
    const key = `${user?.business_id}`;
    const onboardingStep = await getOnboardingStep(key);
    if (onboardingStep !== "completed") {
      redirect(`/onboarding?slug=${user.business.slug}`);
    }
  }
  if (!user?.business_id && user?.business_users.length === 0) {
    redirect("/teams");
  }

  if (user) {
    await setupAnalytics({ userId: user.id });
  }

  return (
    <AI initialAIState={{ user: user, messages: [], chatId: nanoid() }}>
      {children}
    </AI>
  );
}
