import { createClient } from "@loopearn/supabase/server";
import { Apps } from "./apps";

export async function AppsServer({ user }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("apps")
    .select("app_id, settings")
    .eq("business_id", user.business_id);

  return (
    <Apps
      installedApps={data?.map((app) => app.app_id) ?? []}
      user={user}
      settings={data}
    />
  );
}
