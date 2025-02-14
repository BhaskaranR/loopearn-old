import { getCampaigns } from "@loopearn/supabase/cached-queries";
import { Button } from "@loopearn/ui/button";
import Link from "next/link";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function Page() {
  const { data } = await getCampaigns();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Reward Campaigns
          </h2>
          <p className="text-muted-foreground">
            Number of Rewards ({data.length})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/campaigns/create">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg inline-flex items-center">
              <span className="mr-2">+</span>
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
