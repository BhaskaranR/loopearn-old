import { Logo } from "@/components/logo";
import type { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="relative flex flex-col items-center">
        {/* <div className="absolute right-0 top-0">
          <ExitButton />
        </div> */}
        <Logo className="mt-6 font-semibold h-8 w-auto" />
        <div className="mt-8 flex w-full flex-col items-center px-3 pb-16 md:mt-20 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}
