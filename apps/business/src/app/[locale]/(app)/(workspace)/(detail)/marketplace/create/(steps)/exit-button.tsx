"use client";

import { ExpandingArrow } from "@loopearn/ui/icons";
import Link from "next/link";

export function ExitButton() {
  return (
    <Link
      href="/marketplace"
      className="group flex items-center gap-1 p-3 pr-7 text-sm text-black/50 transition-colors enabled:hover:text-black/80"
    >
      Exit
      <ExpandingArrow className="size-3" />
    </Link>
  );
}
