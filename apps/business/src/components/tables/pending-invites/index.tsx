import { getBusinessUser } from "@loopearn/supabase/cached-queries";
import { getBusinessInvitesQuery } from "@loopearn/supabase/queries";
import { createClient } from "@loopearn/supabase/server";
import { DataTable } from "./table";

export async function PendingInvitesTable() {
  const supabase = createClient();
  const user = await getBusinessUser();
  const businessInvites = await getBusinessInvitesQuery(
    supabase,
    user.data.business_id,
  );

  return <DataTable data={businessInvites?.data} currentUser={user?.data} />;
}
