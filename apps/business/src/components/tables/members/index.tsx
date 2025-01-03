import { getBusinessMembersQuery } from "@loopearn/supabase/queries";

import { getUser } from "@loopearn/supabase/cached-queries";
import { createClient } from "@loopearn/supabase/server";
import { DataTable } from "./table";

export async function MembersTable() {
  const supabase = createClient();
  const user = await getUser();
  const teamMembers = await getBusinessMembersQuery(
    supabase,
    user?.data?.business_users[0]?.business_id ?? "",
  );

  return <DataTable data={teamMembers?.data} currentUser={user?.data} />;
}
