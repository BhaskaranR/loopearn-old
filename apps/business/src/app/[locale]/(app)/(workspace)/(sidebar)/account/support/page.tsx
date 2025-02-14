import { SupportForm } from "@/components/support-form";
import { getUser } from "@loopearn/supabase/cached-queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | LoopEarn",
};

export default async function Support() {
  const user = await getUser();
  const userData = user?.data;

  return (
    <div className="space-y-12">
      <div className="max-w-[450px]">
        <SupportForm
          email={userData?.username! || ""}
          avatarUrl={userData?.avatar_url}
          fullName={userData?.full_name}
          teamName={userData?.business_users[0]?.business?.business_name}
        />
      </div>
    </div>
  );
}
