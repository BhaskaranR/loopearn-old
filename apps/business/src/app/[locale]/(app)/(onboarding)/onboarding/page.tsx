import { redirect } from "next/navigation";

export default async function Onboarding({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  redirect(`/onboarding/welcome?slug=${searchParams.slug}`);
}
