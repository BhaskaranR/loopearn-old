import { InfinityIcon } from "@loopearn/ui/icons";
import clsx from "clsx";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "whitespace-nowrap font-display flex items-center text-lg text-black dark:text-white",
        className,
      )}
    >
      <span className="leading-none">L</span>
      <InfinityIcon className="h-5 w-5 -ml-0.5 translate-y-[0.5px] bg-gradient-to-br dark:from-white white:from-black from-black from-30% dark:to-white/40 white:to-black/40 to-black/40" />
      <span className="leading-none">pEarn</span>
    </div>
  );
}
