import { Button, Section } from "@react-email/components";
import Link from "next/link"; // Ensure this import is present

export function GetStarted() {
  return (
    <Section className="text-center mt-[50px] mb-[50px]">
      <Link
        href="https://business.loopearn.com"
        className="bg-transparent rounded-md text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
      >
        List your business
      </Link>

      <Button
        className="bg-transparent rounded-md text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
        href="https://go.loopearn.com/VmJhYxE"
      >
        Get started
      </Button>
    </Section>
  );
}
