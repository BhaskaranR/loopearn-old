import { TeamDropdown } from "@/components/team-dropdown";
import { getTeams, getUser } from "@loopearn/supabase/cached-queries";

export async function TeamMenu() {
  const user = await getUser();
  const teams = await getTeams();

  return (
    <TeamDropdown
      selectedTeamId={user.business_id}
      teams={teams?.data}
      key={user.business_id}
    />
  );
}
