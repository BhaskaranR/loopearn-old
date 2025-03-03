import Link from "next/link";

export function CompleteListingButton({ slug }: { slug: string }) {
  return (
    <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center z-20 ">
      <div className="text-center max-w-md mx-auto flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#878787]">
          To list in LoopEarn marketplace, you need to complete your listing &
          to ensure a secure and compliant experience, we partner with Stripe to
          verify your business through their Know Your Customer (KYC) process.
          This step is crucial for enabling access to our marketplace.
        </p>

        <Link
          href={`/marketplace/create?slug=${slug}`}
          className="w-full px-4 py-2 rounded-md"
        >
          Complete your listing
        </Link>
      </div>
    </div>
  );
}
