import {
  getPendingBusinessInvites,
  getTeams,
  getUser,
} from "@loopearn/supabase/cached-queries";
import { NextResponse } from "next/server";

export const preferredRegion = ["fra1", "sfo1", "iad1"];

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: teams } = await getTeams();
  // algo get the pending invites for the user
  const { data: pendingInvites } = await getPendingBusinessInvites();

  if (user?.business_id) {
    //   get the user's business id (user.business_id) get the team and place it on top of the teams array
    const selectedTeamIndex = teams.findIndex(
      (team) => team.id === user.business_id,
    );
    if (selectedTeamIndex !== -1) {
      const [selectedTeam] = teams.splice(selectedTeamIndex, 1); // Remove the selected team
      teams.unshift(selectedTeam); // Add it to the beginning
    }
    return NextResponse.json({ teams, pendingInvites });
  }

  return NextResponse.json({ teams, pendingInvites });
}
