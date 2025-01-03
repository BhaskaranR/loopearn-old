// import { SystemBanner } from "@/components/system-banner";
import "@/styles/globals.css";
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
      "LoopEarn | Earn now. Close later. Secure your future home with us.",
    template: "%s | LoopEarn",
  },
  description:
    "Reimagining Event-Based Sales &mdash; Connecting you with buyers today for tomorrow's transactions, all in one seamless platform.",
  openGraph: {
    title: "LoopEarn | Earn now. close later, Secure your future home with us.",
    description:
      "Reimagining Event-Based Sales &mdash; Connecting you with buyers today for tomorrow's transactions, all in one seamless platform.",
    url: "https://business.loopearn.com",
    siteName:
      "Reimagining Event-Based Sales &mdash; Connecting you with buyers today for tomorrow's transactions, all in one seamless platform.",
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
