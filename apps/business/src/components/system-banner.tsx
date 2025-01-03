export function SystemBanner() {
  return (
    <div className="p-1 fixed left-0 right-0 top-0 bg-[#FFD02B] z-50 text-center flex items-center justify-center text-black text-sm font-medium">
      <span>
        We are in private beta, onboarding users on a rolling basis. Join our
        waitlist{" "}
        <a href="https://loopearn.com" className="underline">
          here
        </a>{" "}
      </span>
    </div>
  );
}
