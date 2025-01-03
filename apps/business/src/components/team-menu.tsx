import { TeamDropdown } from "@/components/team-dropdown";
import { getBusinessMembers, getUser } from "@loopearn/supabase/cached-queries";

export async function TeamMenu() {
  const user = await getUser();
  const teams = await getBusinessMembers();

  return (
    <TeamDropdown
      selectedTeamId={user?.data?.business_users?.at(0)?.business_id}
      teams={teams?.data}
      key={user?.data?.business_users?.at(0)?.business_id}
    />
  );
}
