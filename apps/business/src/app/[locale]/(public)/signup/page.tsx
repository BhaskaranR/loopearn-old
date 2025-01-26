import { Logo } from "@/components/logo";
import { SystemBanner } from "@/components/system-banner";
import { createClient } from "@loopearn/supabase/client";
import { cookies } from "next/headers";
import Link from "next/link";
import SignUpForm from "./components/SignUpForm";

interface IProps {
  searchParams?: {
    return_to: string;
  };
}

export default async function SignupPage({ searchParams }: IProps) {
  const queryString = new URLSearchParams(searchParams).toString();
  const loginUrl = `/login${queryString ? `?${queryString}` : ""}`;
  const redirectTo = `/${queryString ? `?${queryString}` : ""}`;

  let inviteCode = "";
  if (searchParams?.return_to?.startsWith("teams/invite/")) {
    inviteCode = searchParams.return_to.split("teams/invite/")[1];
  }

  return (
    <>
      <div>
        <header className="w-full fixed left-0 right-0">
          <div className="ml-5 mt-4 md:ml-10 md:mt-10">
            <Link
              href="https://loopearn.com"
              className="inline-flex items-center"
            >
              <Logo className="font-semibold h-8 w-auto" />
            </Link>
          </div>
        </header>

        <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
          <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
            <div className="flex w-full flex-col relative">
              <div className="pointer-events-auto my-6 flex flex-col">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Create an business account
                    </h1>
                  </div>
                  <div className="flex flex-col gap-5">
                    <SignUpForm redirectTo={redirectTo} />
                  </div>

                  <div className="my-8 self-center text-sm">
                    <span className="text-foreground-light">
                      Have an account?
                    </span>{" "}
                    <Link
                      href={loginUrl}
                      className="hover:text-foreground-light text-foreground underline transition"
                    >
                      Sign in now
                    </Link>
                  </div>

                  <p className="text-xs text-[#878787]">
                    By clicking Sign Up, you acknowledge that you have read and
                    agree to LoopEarn&apos;s{" "}
                    <a href="https://loopearn.com/terms" className="underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="https://loopearn.com/policy" className="underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
