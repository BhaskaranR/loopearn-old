import { AI } from "@/actions/ai/chat";
import { setOnboardingProgress } from "@/actions/set-onboarding-progress";
import { Header } from "@/components/header";
import Toolbar from "@/components/onboarding/toolbar";
import { getOnboardingStep } from "@/utils/get-onboarding-step";
import { setupAnalytics } from "@loopearn/events/server";
import { getBusinessUser, getUser } from "@loopearn/supabase/cached-queries";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const ClientSidebarWrapper = dynamic(
  () =>
    import("@/components/sidebar-wrapper").then((mod) => mod.SidebarWrapper),
  { ssr: false },
);

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user?.business_id && user?.business_users.length === 0) {
    redirect("/teams");
  }

  const key = `${user?.business_id}`;

  const onboardingStep = await getOnboardingStep(key);
  if (
    !(onboardingStep === "stripe-pending" || onboardingStep === "completed")
  ) {
    redirect(`/onboarding?slug=${user.business.slug}`);
  }

  if (user) {
    await setupAnalytics({ userId: user.id });
  }

  return (
    <AI initialAIState={{ user: user, messages: [], chatId: nanoid() }}>
      <ClientSidebarWrapper headerContent={<Header />}>
        {children}
        <Toolbar show={["onboarding"]} />
      </ClientSidebarWrapper>
    </AI>
  );
}
