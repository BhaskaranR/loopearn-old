import { WorkflowPage } from "@/components/campaign/workflow/workflow-page";
import { getCampaignById } from "@loopearn/supabase/cached-queries";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { data: campaign } = await getCampaignById(params.id);

  return <WorkflowPage campaignId={params.id} campaign={campaign} />;
}
