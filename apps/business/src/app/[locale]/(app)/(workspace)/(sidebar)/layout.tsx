import { AI } from "@/actions/ai/chat";
import { Header } from "@/components/header";
import Toolbar from "@/components/onboarding/toolbar";
import { getOnboardingStep } from "@/utils/get-onboarding-step";
import { setupAnalytics } from "@loopearn/events/server";
import {
  getPendingBusinessInvites,
  getTeams,
  getUser,
} from "@loopearn/supabase/cached-queries";
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
  return (
    <ClientSidebarWrapper headerContent={<Header />}>
      {children}
      <Toolbar show={["onboarding"]} />
    </ClientSidebarWrapper>
  );
}
