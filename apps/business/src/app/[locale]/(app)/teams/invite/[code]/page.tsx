import { UserMenu } from "@/components/user-menu";
import { createClient } from "@loopearn/supabase/admin";
import { canJoinTeamByInviteCode } from "@loopearn/supabase/mutations";
import { Avatar, AvatarFallback, AvatarImageNext } from "@loopearn/ui/avatar";
import { Button } from "@loopearn/ui/button";
import { Card, CardContent, CardFooter } from "@loopearn/ui/card";
import { Logo } from "@loopearn/ui/logo";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Join team | LoopEarn",
};

export default async function InviteCode({
  params,
}: { params: { code: string } }) {
  // if user is logged in, redirect to /teams
  const supabase = createClient();
  const { code } = params;
  const inviteData = await canJoinTeamByInviteCode(supabase, code);
  // implement
  if (!inviteData) {
    return (
      <div>
        <header className="w-full absolute left-0 right-0 flex justify-between items-center">
          <div className="ml-5 mt-4 md:ml-10 md:mt-10">
            <Link href="/" className="inline-flex items-center">
              <Logo className="font-semibold h-8 w-auto" />
            </Link>
          </div>

          <div className="mr-5 mt-4 md:mr-10 md:mt-10">
            <Suspense>
              <UserMenu onlySignOut />
            </Suspense>
          </div>
        </header>

        <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
          <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
            <div className="flex w-full flex-col relative">
              <div className="pb-4">
                <h1 className="font-medium pb-1 text-3xl">
                  No invite link found or expired
                </h1>
              </div>

              <p className="font-medium pb-1 text-2xl text-[#606060]">
                Notify the sender for a new one.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="w-full absolute left-0 right-0 flex justify-between items-center">
        <div className="ml-5 mt-4 md:ml-10 md:mt-10">
          <Link href="/" className="inline-flex items-center">
            <Logo className="font-semibold h-8 w-auto" />
          </Link>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-center">
              <Avatar className="rounded-full w-8 h-8 cursor-pointer">
                {inviteData.business.avatar_url && (
                  <AvatarImageNext
                    src={inviteData.business.avatar_url}
                    alt={inviteData.business.business_name}
                    width={32}
                    height={32}
                    quality={100}
                  />
                )}
                <AvatarFallback>
                  <span className="text-sm">
                    {inviteData.business.business_name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold">
                {inviteData.user.full_name} has invited you to{" "}
                {inviteData.business.business_name}
              </h1>
              <p className="text-gray-600">
                Empower your local business with LoopEarn! Easily list your
                services, create engaging campaigns, and attract customers
                through gamified deals that drive sales and loyalty.
              </p>
            </div>
            <div className="space-y-4 pt-4">
              <p className="text-center text-gray-600">
                To accept the invitation please login as{" "}
                <span className="font-medium">{inviteData.email}</span>.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link
              href={`/login?email=${inviteData.email}&invite_code=${code}`}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-center py-2 rounded-md px-4 font-medium"
            >
              Log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
