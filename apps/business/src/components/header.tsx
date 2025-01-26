import { AssistantButton } from "@/components/assistant/button";
import { DesktopAssistantButton } from "@/components/assistant/button-desktop";
import { NotificationCenter } from "@/components/notification-center";
import { UserMenu } from "@/components/user-menu";
import { BrowserNavigation } from "@/desktop/components/browser-navigation";
import { Separator } from "@loopearn/ui/separator";
import { SidebarTrigger } from "@loopearn/ui/sidebar";
import { Skeleton } from "@loopearn/ui/skeleton";
import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
import { Suspense } from "react";
import { DesktopTrafficLight } from "./desktop-traffic-light";
import { FeedbackForm } from "./feedback-form";

export function Header() {
  return (
    <header className="-ml-4 mr-4 md:m-0 z-10 px-4 md:px-0 md:border-b-[1px] flex justify-between pt-4 pb-2 md:pb-4 items-center todesktop:sticky todesktop:top-0 todesktop:bg-background todesktop:border-none sticky md:static top-0 backdrop-filter backdrop-blur-xl md:backdrop-filter md:backdrop-blur-none dark:bg-[#121212] bg-[#fff] bg-opacity-70 ">
      {isDesktopApp() && <DesktopTrafficLight />}
      {isDesktopApp() && <BrowserNavigation />}
      <SidebarTrigger className="ml-3 md:hidden" />

      <Separator orientation="vertical" className="mr-2 h-4" />

      <AssistantButton />

      <div className="flex space-x-2 no-drag ml-auto">
        {isDesktopApp() && <DesktopAssistantButton />}

        <FeedbackForm />

        <NotificationCenter />

        <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}
