export function SystemBanner() {
  return (
    <a
      className="group relative top-0 bg-primary py-2 text-primary-foreground transition-all duration-300 md:py-4 block keychainify-checked"
      href="/affiliates"
    >
      <div className="container justify-center h-full flex items-center text-sm">
        ✨
        <span className="ml-1 font-medium">
          <span className="md:hidden">Join our new Affiliate Program!</span>
          <span className="hidden md:inline">
            Join our Affiliate Program and earn up to 20% on each subscription!
          </span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="ml-1 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </a>
  );
}
