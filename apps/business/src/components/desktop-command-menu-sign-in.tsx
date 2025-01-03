"use client";

import { Button } from "@loopearn/ui/button";
import { Logo } from "./logo";

export function DesktopCommandMenuSignIn() {
  return (
    <div className="flex h-full flex-col">
      <Logo className="absolute top-8 left-8" />

      <div className="flex items-center w-full justify-center h-full">
        <a href="loopearn://">
          <Button variant="outline">Login to LoopEarn</Button>
        </a>
      </div>
    </div>
  );
}
