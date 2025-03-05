import { WorkflowPage } from "@/components/campaign/workflow/workflow-page";
import { getCampaignById } from "@loopearn/supabase/cached-queries";
import { redirect } from "next/navigation";
export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { data: campaign } = await getCampaignById(params.id);

  if (!campaign) {
    return redirect("/not-found");
  }

  return <WorkflowPage campaignId={params.id} campaign={campaign} />;
}
