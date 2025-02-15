"use client";

import { Button } from "@loopearn/ui/button";
import { Card } from "@loopearn/ui/card";
import { cn } from "@loopearn/ui/cn";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  isConnected?: boolean;
}

const socialPlatforms: SocialPlatform[] = [
  // Row 1
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook className="h-8 w-8 text-[#1877F2]" />,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="h-8 w-8 text-[#E4405F]" />,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <Image src="/icons/tiktok.svg" alt="TikTok" width={32} height={32} />,
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: <Twitter className="h-8 w-8" />,
  },
  {
    id: "threads",
    name: "Threads",
    icon: (
      <Image src="/icons/threads.svg" alt="Threads" width={32} height={32} />
    ),
  },
  // Row 2
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="h-8 w-8 text-[#0A66C2]" />,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: (
      <Image
        src="/icons/pinterest.svg"
        alt="Pinterest"
        width={32}
        height={32}
      />
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <Youtube className="h-8 w-8 text-[#FF0000]" />,
  },
  {
    id: "mastodon",
    name: "Mastodon",
    icon: (
      <Image src="/icons/mastodon.svg" alt="Mastodon" width={32} height={32} />
    ),
  },
  // Row 3
  {
    id: "google",
    name: "Google",
    icon: <Image src="/icons/google.svg" alt="Google" width={32} height={32} />,
  },
  {
    id: "wordpress",
    name: "Wordpress",
    icon: <Globe className="h-8 w-8 text-[#21759B]" />,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: <Send className="h-8 w-8 text-[#26A5E4]" />,
  },
];

export default function SocialAccountsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Link
          href="/campaigns"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Add your social accounts
        </h1>
        <p className="text-muted-foreground text-center mb-5">
          Connect your Facebook, Instagram, Twitter, LinkedIn, and so on
        </p>

        <Card className="w-full p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {socialPlatforms.map((platform) => (
              <div
                key={platform.id}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed",
                  "hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer",
                  platform.isConnected && "border-primary bg-primary/5",
                )}
              >
                {platform.icon}
                <span className="mt-2 text-sm font-medium">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Button size="lg" className="mt-6">
          Continue
        </Button>
      </div>
    </div>
  );
}
