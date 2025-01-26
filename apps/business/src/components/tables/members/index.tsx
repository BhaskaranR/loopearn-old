import { getBusinessMembers, getUser } from "@loopearn/supabase/cached-queries";
import { DataTable } from "./table";

export async function MembersTable() {
  const user = await getUser();
  const teamMembers = await getBusinessMembers();

  return <DataTable data={teamMembers?.data} currentUser={user} />;
}
