import { AppsHeader } from "@/components/apps/apps-header";
import { AppsServer } from "@/components/apps/apps.server";
import { AppsSkeleton } from "@/components/apps/apps.skeleton";
import { getUser } from "@loopearn/supabase/cached-queries";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Apps | Loopearn",
};

export default async function Page() {
  const user = await getUser();

  return (
    <div className="mt-4">
      <AppsHeader />

      <Suspense fallback={<AppsSkeleton />}>
        <AppsServer user={user} />
      </Suspense>
    </div>
  );
}
