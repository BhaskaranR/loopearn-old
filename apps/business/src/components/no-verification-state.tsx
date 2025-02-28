import StripeConnectButton from "./stripe-connect-button";

export function NoVerificationState() {
  return (
    <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center z-20 ">
      <div className="text-center max-w-md mx-auto flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-medium mb-2">Verify your account</h2>
        <p className="text-sm text-[#878787]">
          To ensure a secure and compliant experience, we partner with Stripe to
          verify your business through their Know Your Customer (KYC) process.
          This step is crucial for enabling access to our marketplace.
        </p>

        <img
          src="https://assets.dub.co/misc/stripe-wordmark.svg"
          alt="Stripe wordmark"
          className="aspect-[96/40] h-12 "
        />
        <StripeConnectButton text="Continue to Stripe" />
      </div>
    </div>
  );
}
