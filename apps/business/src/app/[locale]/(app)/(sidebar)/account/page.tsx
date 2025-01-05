import { ChangeTheme } from "@/components/change-theme";
import { DeleteAccount } from "@/components/delete-account";
import { DisplayName } from "@/components/display-name";
import { UserAvatar } from "@/components/user-avatar";
import { getUser } from "@loopearn/supabase/cached-queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | LoopEarn",
};

export default async function Account() {
  const user = await getUser();

  return (
    <div className="space-y-12">
      <UserAvatar
        userId={user?.id}
        fullName={user?.full_name}
        avatarUrl={user?.avatar_url}
      />
      <DisplayName fullName={user?.full_name} />
      <ChangeTheme />
      <DeleteAccount />
    </div>
  );
}
