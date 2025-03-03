import { Logo } from "@loopearn/ui/logo";
import { NavigationFooter } from "../navigation-footer";
import { NextButton } from "../next-button";
import { LottieAnimation } from "./lottie-animation";

export default async function Welcome({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  return (
    <>
      <Logo className="mt-6 font-semibold h-8 w-auto absolute left-10 top-0" />
      <div className="relative mx-auto mt-24 flex md:max-w-fit flex-col items-center px-3 text-center md:mt-32 md:px-8 lg:mt-48">
        <div className="grid lg:grid-cols-2 gap-8 py-12">
          <div className="space-y-6 text-left max-w-md">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                Create your profile for LoopEarn Marketplace
              </h1>
            </div>
            <p className="text-muted-foreground text-lg text-left leading-relaxed">
              follow the steps below to create your profile for LoopEarn
              Marketplace
            </p>
          </div>
          <LottieAnimation />
        </div>
        <NavigationFooter isBackVisible={false} currentStep={0}>
          <NextButton text="Next" step="info" className="ml-auto" />
        </NavigationFooter>
      </div>
    </>
  );
}
