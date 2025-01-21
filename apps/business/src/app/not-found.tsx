import { Logo } from "@/components/logo";
import { NewBackground } from "@/components/onboarding/new-background";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="relative z-10 flex h-screen w-screen flex-col items-center justify-center gap-6">
        <Link href="/" className="absolute left-4 top-3">
          <Logo className="font-semibold h-8 w-auto" />
        </Link>
        <h1 className="font-display bg-gradient-to-r from-black to-gray-600 bg-clip-text text-5xl font-semibold text-transparent">
          404
        </h1>
        <Link
          href="/"
          className="flex h-9 w-fit items-center justify-center rounded-md border border-black bg-black px-4 text-sm text-white hover:bg-gray-800 hover:ring-4 hover:ring-gray-200"
        >
          Go back home
        </Link>
      </div>
      <NewBackground showAnimation />
    </>
  );
}
