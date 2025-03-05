"use client";

import type { CreateCampaignFormValues } from "@/actions/schema";
import { emptyTemplate } from "@/utils/campaigns";
import { Button } from "@loopearn/ui/button";
import { Drawer, DrawerContent } from "@loopearn/ui/drawer";
import { useMediaQuery } from "@loopearn/ui/hooks";
import { Icons } from "@loopearn/ui/icons";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@loopearn/ui/sheet";
import { useQueryState } from "nuqs";
import React from "react";
import CampaignForm from "./campaign-form";

export function CampaignCreateSheet() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useQueryState("create-campaign");

  const isOpen = Boolean(open);

  const template = emptyTemplate;

  // Create initial form data from template
  const initialFormData: CreateCampaignFormValues = {
    name: template.defaultName,
    description: template.defaultDescription,
    type: template.type,
    is_repeatable: template.is_repeatable,
    max_achievement: template.max_achievement,
    min_tier: template.min_tier,
    visibility: template.visibility,
    status: template.status,
    is_live_on_marketplace: template.is_live_on_marketplace,
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open ? "true" : null);
  };

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent>
          <SheetHeader className="mb-8">
            <SheetTitle>Create Campaign</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full p-0 pb-[100px]" hideScrollbar>
            <CampaignForm
              template={template}
              redirectTo="/campaigns/create/workflow"
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="p-6">
        <CampaignForm
          template={template}
          redirectTo="/campaigns/create/workflow"
        />
      </DrawerContent>
    </Drawer>
  );
}
