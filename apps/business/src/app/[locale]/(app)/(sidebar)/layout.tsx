import { AI } from "@/actions/ai/chat";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { setupAnalytics } from "@loopearn/events/server";

import { getUser } from "@loopearn/supabase/cached-queries";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const AssistantModal = dynamic(
  () =>
    import("@/components/assistant/assistant-modal").then(
      (mod) => mod.AssistantModal,
    ),
  {
    ssr: false,
  },
);

const HotKeys = dynamic(
  () => import("@/components/hot-keys").then((mod) => mod.HotKeys),
  {
    ssr: false,
  },
);

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user?.data?.business_users?.length) {
    redirect("/teams");
  }

  if (user) {
    await setupAnalytics({ userId: user.data.id });
  }

  return (
    <div className="relative">
      <AI initialAIState={{ user: user.data, messages: [], chatId: nanoid() }}>
        <Sidebar />

        <div className="mx-4 md:ml-[95px] md:mr-10 pb-8">
          <Header />
          {children}
        </div>

        <AssistantModal />

        <HotKeys />
      </AI>
    </div>
  );
}
