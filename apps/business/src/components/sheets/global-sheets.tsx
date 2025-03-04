import { Cookies } from "@/utils/constants";
import { getUser } from "@loopearn/supabase/cached-queries";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { CampaignCreateSheet } from "./campaign/campaign-create-sheet";

type Props = {
  defaultCurrency: string;
};

export async function GlobalSheets({ defaultCurrency }: Props) {
  const userData = await getUser();

  return (
    <>
      <Suspense fallback={null}>
        <CampaignCreateSheet
          teamId={userData?.business_id}
          userId={userData?.id}
        />
      </Suspense>
    </>
  );
}
