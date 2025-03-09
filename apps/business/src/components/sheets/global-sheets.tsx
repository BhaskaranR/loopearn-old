import { Suspense } from "react";
import { CampaignCreateSheet } from "../campaign/campaign-create-sheet";

export async function GlobalSheets() {
  return (
    <>
      <Suspense fallback={null}>
        <CampaignCreateSheet />
      </Suspense>
    </>
  );
}
