import { getUser } from "@loopearn/supabase/cached-queries";
import {
  getTeamsByUserIdQuery,
  getUserInvitesQuery,
} from "@loopearn/supabase/queries";
import { createClient } from "@loopearn/supabase/server";
import { DataTable } from "./table";

export async function TeamsTable() {
  const supabase = createClient();
  const user = await getUser();

  const [teams, invites] = await Promise.all([
    getTeamsByUserIdQuery(supabase, user?.id),
    getUserInvitesQuery(supabase, user?.username),
  ]);

  return (
    <DataTable
      data={[
        ...(teams?.data ?? []),
        ...(invites?.data?.map((invite) => ({ ...invite, isInvite: true })) ??
          []),
      ]}
    />
  );
}
