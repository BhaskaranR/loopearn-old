import { DeleteTeam } from "@/components/delete-team";
import { TeamAvatar } from "@/components/team-avatar";
import { TeamName } from "@/components/team-name";
import { getUser } from "@loopearn/supabase/cached-queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Settings | LoopEarn",
};

export default async function Account() {
  const user = await getUser();

  return (
    <div className="space-y-12">
      <TeamAvatar
        teamId={user?.data?.business_users[0]?.business_id}
        name={user?.data?.business_users[0]?.business?.business_name}
        logoUrl={user?.data?.business_users[0]?.business?.avatar_url}
      />

      <TeamName name={user?.data?.business_users[0]?.business?.business_name} />
      <DeleteTeam teamId={user?.data?.business_users[0]?.business_id!} />
    </div>
  );
}
