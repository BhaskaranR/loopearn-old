"use client";

import { Button } from "@loopearn/ui/button";
import { cn } from "@loopearn/ui/cn";
import { Input } from "@loopearn/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft, Box, Gift, Ticket, Wallet, X } from "lucide-react";
import * as React from "react";
import "./spin-wheel.css";

interface SpinWheelProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  onBack?: () => void;
}

const WHEEL_DATA = [
  {
    id: 1,
    label: "100 Points",
    icon: Gift,
    isAlternate: true,
  },
  {
    id: 2,
    label: "Free Product",
    icon: Box,
    isAlternate: false,
  },
  {
    id: 3,
    label: "25% coupon",
    icon: Ticket,
    isAlternate: true,
  },
  {
    id: 4,
    label: "10 EUR coupon",
    icon: Wallet,
    isAlternate: false,
  },
];

export function SpinWheel({
  className,
  onClose,
  onBack,
  ...props
}: SpinWheelProps) {
  const [spinning, setSpinning] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);
  const [email, setEmail] = React.useState("");

  const handleSpin = (e: React.FormEvent) => {
    e.preventDefault();
    if (spinning || !email) return;

    setSpinning(true);
    const spins = 5 + Math.floor(Math.random() * 5); // 5-9 spins
    const extraDegrees = Math.floor(Math.random() * 360);
    const newRotation = rotation + spins * 360 + extraDegrees;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
    }, 4000);
  };

  return (
    <div className={cn("w-full max-w-md mx-auto px-4", className)} {...props}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          type="button"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Wheel Container */}
      <div className="relative aspect-square mb-8">
        {/* Wheel Border */}
        <div className="absolute inset-[-12px] rounded-full bg-white shadow-[var(--spin-wheel-shadow)]" />

        {/* Wheel */}
        <div className="relative w-full h-full">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0, 0.2, 1] }}
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{ transformOrigin: "center center" }}
          >
            {WHEEL_DATA.map((segment, index) => {
              const Icon = segment.icon;
              return (
                <div
                  key={segment.id}
                  className={cn(
                    "absolute w-1/2 h-1/2 origin-bottom-right",
                    segment.isAlternate ? "bg-[#E5EEF0]" : "bg-white",
                  )}
                  style={{
                    transform: `rotate(${index * 90}deg)`,
                  }}
                >
                  <div
                    className="absolute left-0 top-0 w-full h-full"
                    style={{
                      transform: `rotate(45deg)`,
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 absolute left-1/2 top-[20%] -translate-x-1/2">
                      <Icon
                        className={cn(
                          "h-7 w-7",
                          segment.isAlternate ? "text-white" : "text-black",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium whitespace-nowrap",
                          segment.isAlternate ? "text-white" : "text-black",
                        )}
                      >
                        {segment.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Pointer */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[var(--spin-wheel-pointer-size)] h-[var(--spin-wheel-pointer-size)] z-20"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          >
            <div
              className="w-full h-full bg-[#E5EEF0]"
              style={{
                clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
              }}
            />
          </div>

          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E5EEF0] border-[6px] border-white shadow-md z-10" />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSpin} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 text-base rounded-xl border-gray-200"
        />
        <Button
          type="submit"
          disabled={spinning || !email}
          className="w-full h-12 text-base font-medium bg-[#E5EEF0] hover:bg-[#d5e1e3] text-black rounded-xl"
        >
          Spin & Win!
        </Button>
      </form>

      {/* Footer text */}
      <p className="mt-6 text-center text-sm text-gray-500 px-4">
        From time to time we will send you special offers. you can unsubscribe
        at any time.
      </p>
    </div>
  );
}
