"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { I18nProviderClient } from "@/locales/client";
import { TooltipProvider } from "@loopearn/ui/tooltip";
import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
import type { ReactNode } from "react";

// We need to import it here because this is the first
// client component
if (isDesktopApp()) {
  require("@/desktop/main");
}

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ locale, children }: ProviderProps) {
  return (
    <TooltipProvider>
      <I18nProviderClient locale={locale}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </I18nProviderClient>
    </TooltipProvider>
  );
}
