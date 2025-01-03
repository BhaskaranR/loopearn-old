import { ConsentBanner } from "@/components/consent-banner";
import { DesktopCommandMenuSignIn } from "@/components/desktop-command-menu-sign-in";
import { Logo } from "@/components/logo";
import { OTPSignIn } from "@/components/otp-sign-in";
import { Cookies } from "@/utils/constants";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { userAgent } from "next/server";

export const metadata: Metadata = {
  title: "Login | LoopEarn",
};

export default async function Page(params) {
  if (params?.searchParams?.return_to === "desktop/command") {
    return <DesktopCommandMenuSignIn />;
  }

  const cookieStore = cookies();
  const preferred = cookieStore.get(Cookies.PreferredSignInProvider);

  const moreSignInOptions = null;
  const preferredSignInOption = (
    <OTPSignIn className="border-t-[1px] border-border pt-8" />
  );

  return (
    <div>
      <header className="w-full fixed left-0 right-0">
        <div className="ml-5 mt-4 md:ml-10 md:mt-10">
          <Link
            href="https://loopearn.com"
            className="items-center gap-6 space-x-2 md:flex keychainify-checked"
          >
            <Logo className="hidden font-semibold sm:inline-block" />
          </Link>
        </div>
      </header>

      <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
          <div className="flex w-full flex-col relative">
            <div className="pb-4 bg-gradient-to-r from-primary dark:via-primary dark:to-[#848484] to-[#000] inline-block text-transparent bg-clip-text">
              <h1 className="font-medium pb-1 text-3xl">Login to LoopEarn.</h1>
            </div>

            <p className="font-medium pb-1 text-2xl text-[#878787]">
              Earn now. Close later. <br /> Secure your future home with us.
            </p>

            <div className="pointer-events-auto mt-6 flex flex-col mb-6">
              {preferredSignInOption}
            </div>
            <div className="my-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>

            <p className="text-xs text-[#878787]">
              By clicking continue, you acknowledge that you have read and agree
              to LoopEarn's{" "}
              <a href="https://loopearn.com/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="https://loopearn.com/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
