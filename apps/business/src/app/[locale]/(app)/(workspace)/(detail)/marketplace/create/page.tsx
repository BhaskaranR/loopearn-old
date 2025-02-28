import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { createClient } from "@loopearn/supabase/server";
import { redirect } from "next/navigation";

export default async function CreateListing({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  if (!searchParams.slug) {
    redirect("/marketplace/create/welcome");
  }
  const supabase = createClient();

  const business = await getBusinessBySlug(searchParams.slug);
  if (!business) {
    redirect("not-found");
  }

  if (!business.marketplace_onboarding_step) {
    redirect(`/marketplace/create/welcome?slug=${searchParams.slug}`);
  } else {
    redirect(
      `/marketplace/create/${business.marketplace_onboarding_step}?slug=${searchParams.slug}`,
    );
  }
}
