"use client";

import { CampaignTemplates } from "@/components/campaign-templates";
import { CampaignCreateSheet } from "@/components/campaign/campaign-create-sheet";
import { CampaignSidebar } from "@/components/campaign/campaign-sidebar";
import { Badge } from "@loopearn/ui/badge";
import { Card } from "@loopearn/ui/card";
import { cn } from "@loopearn/ui/cn";
import { ExpandingArrow } from "@loopearn/ui/icons";
import { SidebarProvider } from "@loopearn/ui/sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  parseAsBoolean,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useQueryState("type");
  const [_, setParams] = useQueryStates({
    "create-campaign": parseAsBoolean,
  });

  return (
    <div className="flex h-full">
      <div className="absolute right-0 top-0">
        <Link
          href="/campaigns"
          className="group flex items-center gap-1 p-3 pr-7 text-sm text-black/50 transition-colors enabled:hover:text-black/80"
        >
          Exit
          <ExpandingArrow className="size-3" />
        </Link>
      </div>
      <SidebarProvider defaultOpen>
        <CampaignSidebar
          selectedType={selectedType}
          onSelectType={(type) => setSelectedType(type || null)}
        />
        <div className="flex-1 space-y-6 p-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Create Campaign
            </h2>
          </div>

          {/* Quick Start Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card
                className={cn(
                  "p-6 cursor-pointer hover:border-primary transition-colors flex items-center justify-center gap-3",
                )}
                onClick={() => setParams({ "create-campaign": true })}
              >
                <Plus className="h-5 w-5" />
                <span className="text-lg font-medium">
                  Create Advanced Campaign
                </span>
              </Card>
            </div>
          </div>

          {/* Popular Templates Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Campaigns used by businesses similar to yours!
              </h3>
              <Badge variant="blue" className="bg-green-50 text-green-700">
                For you
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CampaignTemplates.filter(
                (t) => !selectedType || t.type === selectedType,
              ).map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "p-6 cursor-pointer hover:border-primary transition-colors",
                    selectedType === template.id && "border-primary",
                  )}
                  onClick={() =>
                    router.push(`/campaigns/create/${template.id}`)
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {template.title}
                        {template.comingSoon && (
                          <Badge variant="blue" className="text-xs ml-2">
                            Coming Soon
                          </Badge>
                        )}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <template.icon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarProvider>

      <CampaignCreateSheet />
    </div>
  );
}
