import Link from "next/link";

import { CompleteListingButton } from "@/components/complete-listing-button";
import { ImageGallery } from "@/components/images/image-gallery";
import { ImagesList } from "@/components/images/image-list";
import { NoVerificationState } from "@/components/no-verification-state";
import {
  getBusinessMarketplace,
  getUser,
} from "@loopearn/supabase/cached-queries";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@loopearn/ui/breadcrumb";
import { Button } from "@loopearn/ui/button";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { redirect } from "next/navigation";

export default async function Marketplace() {
  // get business marketplace

  const marketplace = await getBusinessMarketplace();
  const user = await getUser();

  const isVerified = user?.business.payouts_enabled;
  const slug = user?.business?.slug;

  if (!marketplace || (marketplace && marketplace.status !== "approved")) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#">Marketplace</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {/* {!isVerified && <NoVerificationState />} */}

            {!isVerified && <CompleteListingButton slug={slug} />}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Marketplace</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ScrollArea
            className="h-[calc(100vh-5px)]  bg-background flex w-full flex-col gap-4 text-left"
            hideScrollbar
          >
            <div className="flex flex-col items-start p-4">
              <div className="overflow-auto max-h-64 mb-4 flex-1" />
              <Button className="mt-4 px-4 py-2 border rounded">
                Complete your listing
              </Button>
            </div>

            {!isVerified && <NoVerificationState />}

            <div className="relative flex flex-col items-center min-h-screen ">
              <div className="flex w-full max-w-5xl flex-col items-center justify-center">
                <ImagesList
                  className="hidden md:block"
                  images={marketplace.profile_photos}
                />
                <ImageGallery
                  className="block md:hidden"
                  images={marketplace.profile_photos}
                />
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
