import { Logo } from "@loopearn/ui/logo";
import type { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="relative flex flex-col items-center">
        <Logo className="mt-6 font-semibold h-8 w-auto" />
        <div className="mt-5 flex w-full flex-col items-center px-3 pb-16 md:mt-15 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}
