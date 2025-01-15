import { NewBackground } from "@/components/onboarding/new-background";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <NewBackground />
      {children}
    </>
  );
}
