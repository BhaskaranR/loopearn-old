import { getBusinessMembersQuery } from "@loopearn/supabase/queries";

import { getUser } from "@loopearn/supabase/cached-queries";
import { createClient } from "@loopearn/supabase/server";
import { DataTable } from "./table";

export async function MembersTable() {
  const supabase = createClient();
  const user = await getUser();
  const teamMembers = await getBusinessMembersQuery(
    supabase,
    user?.business_id ?? "",
  );

  return <DataTable data={teamMembers?.data} currentUser={user} />;
}
