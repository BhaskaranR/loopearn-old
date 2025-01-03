import { getUser } from "@loopearn/supabase/cached-queries";
import { createClient } from "@loopearn/supabase/server";
import { download } from "@loopearn/supabase/storage";

export const preferredRegion = ["fra1", "sfo1", "iad1"];

export async function GET(req, res) {
  const supabase = createClient();
  const user = await getUser();
  const requestUrl = new URL(req.url);
  const path = requestUrl.searchParams.get("path");
  const filename = requestUrl.searchParams.get("filename");

  const { data } = await download(supabase, {
    bucket: "vault",
    path: `${user?.data?.business_users?.[0]?.business_id ?? ""}/${path}`,
  });

  const responseHeaders = new Headers(res.headers);

  responseHeaders.set(
    "Content-Disposition",
    `attachment; filename="${filename}"`,
  );

  return new Response(data, {
    headers: responseHeaders,
  });
}
