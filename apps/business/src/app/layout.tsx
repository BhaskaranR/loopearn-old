// import { SystemBanner } from "@/components/system-banner";
import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import { cn } from "@loopearn/ui/cn";
import "@loopearn/ui/globals.css";

import { Provider as Analytics } from "@loopearn/events/client";
import { Toaster } from "@loopearn/ui/toaster";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://business.loopearn.com"),
  title: {
    default:
      "LoopEarn | Earn While You Learn, Unlock Potential, Earn Rewards: The Community-Powered Platform",
    template: "%s | LoopEarn",
  },
  description:
    "Empower your local business with LoopEarn! Easily list your services, create engaging campaigns, and attract customers through gamified deals that drive sales and loyalty.",
  openGraph: {
    title:
      "LoopEarn | Earn While You Learn, Unlock Potential, Earn Rewards: The Community-Powered Platform",
    description:
      "Empower your local business with LoopEarn! Easily list your services, create engaging campaigns, and attract customers through gamified deals that drive sales and loyalty.",
    url: "https://business.loopearn.com",
    siteName:
      "Empower your local business with LoopEarn! Easily list your services, create engaging campaigns, and attract customers through gamified deals that drive sales and loyalty.",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://cdn.loopearn.com/opengraph-image.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "https://cdn.loopearn.com/opengraph-image.jpg",
        width: 1800,
        height: 1600,
      },
    ],
  },
  twitter: {
    title: "LoopEarn | Earn now. Close later. Secure your future home with us.",
    description: "This is my portfolio.",
    images: [
      {
        url: "https://cdn.loopearn.com/opengraph-image.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "https://cdn.loopearn.com/opengraph-image.jpg",
        width: 1800,
        height: 1600,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export const preferredRegion = ["fra1", "sfo1", "iad1"];
export const maxDuration = 60;

export default function Layout({
  children,
  params,
}: {
  children: ReactElement;
  params: { locale: string };
}) {
  const locale = params?.locale || "en"; // Default to 'en' if locale is undefined

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} ${GeistMono.variable}`,
          "whitespace-pre-line overscroll-none",
        )}
      >
        <Providers locale={locale}>{children}</Providers>
        {/* <SystemBanner /> */}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
