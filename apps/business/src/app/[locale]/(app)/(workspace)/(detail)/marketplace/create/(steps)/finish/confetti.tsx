"use client";
import { Confetti, type ConfettiRef } from "@loopearn/ui/magicui/confetti";
import { useEffect, useRef } from "react";

export function ConfettiDemo() {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    confettiRef.current?.fire({
      particleCount: 100,
      spread: 100,
    });
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <h1 className="animate-slide-up-fade mt-10 text-2xl font-medium [--offset:10px] [animation-delay:250ms] [animation-duration:1s] [animation-fill-mode:both]">
        Congratulations, for submitting your Listing!
      </h1>
      <Confetti
        ref={confettiRef}
        className="fixed left-0 top-0 z-0 w-full size-full"
      />
    </div>
  );
}
