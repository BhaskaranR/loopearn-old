import clsx from "clsx";
import React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={clsx("whitespace-nowrap font-display", className)}>
      <span className="text-lg">LoopEarn</span>
    </div>
  );
}

export const LogoIcon = () => (
  <svg
    width="16"
    height="24"
    viewBox="0 0 16 24"
    fill="currentcolor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 23H0V8H7V23Z" />
    <path d="M7 0H0V7H7V0Z" />
    <path d="M11.5 7C13.433 7 15 5.433 15 3.5C15 1.567 13.433 0 11.5 0C9.56704 0 8 1.567 8 3.5C8 5.433 9.56704 7 11.5 7Z" />
  </svg>
);
