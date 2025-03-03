"use client";

import { Button } from "@loopearn/ui/button";
import { Logo } from "@loopearn/ui/logo";

export function DesktopCommandMenuSignIn() {
  return (
    <div className="flex h-full flex-col">
      <Logo className="absolute top-8 left-8 inline-flex items-center font-semibold h-8 w-auto" />

      <div className="flex items-center w-full justify-center h-full">
        <a href="loopearn://">
          <Button variant="outline">Login to LoopEarn</Button>
        </a>
      </div>
    </div>
  );
}
