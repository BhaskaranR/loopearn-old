import { Icons } from "@loopearn/ui/icons";
import { Logo } from "@loopearn/ui/logo";
import Link from "next/link";

type Props = {
  firstName: string;
};

export function ChatEmpty({ firstName }: Props) {
  return (
    <div className="w-full mt-[200px] todesktop:mt-24 md:mt-24 flex flex-col items-center justify-center text-center">
      <Logo className="hidden sm:inline-flex items-center font-semibold h-8 w-auto" />
      <span className="font-medium text-xl mt-6">
        Hi {firstName}, how can I help <br />
        you today?
      </span>
    </div>
  );
}
