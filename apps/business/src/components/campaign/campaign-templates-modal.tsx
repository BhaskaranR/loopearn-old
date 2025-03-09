"use client";

import { Badge } from "@loopearn/ui/badge";
import { Card } from "@loopearn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@loopearn/ui/dialog";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { SidebarProvider } from "@loopearn/ui/sidebar";
import {
  Background,
  Controls,
  type Edge,
  type Node,
  ReactFlow,
} from "@xyflow/react";
import React from "react";
import "@xyflow/react/dist/style.css";
import { CampaignTemplates } from "@/components/campaign-templates";
import { CampaignSidebar } from "@/components/campaign/campaign-sidebar";
import type { CampaignTemplate } from "@/utils/campaigns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@loopearn/ui/breadcrumb";
import { Button } from "@loopearn/ui/button";
import { cn } from "@loopearn/ui/cn";
import { Bell, ChevronRight, Mail, MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsBoolean } from "nuqs";
import { useQueryStates } from "nuqs";
import CampaignForm from "./campaign-form";

function getInitialNodes(): Node[] {
  return [
    {
      id: "trigger",
      type: "default",
      data: {
        label: (
          <div className="flex flex-col items-center p-4">
            <div className="text-sm font-medium mb-1">TRIGGER</div>
            <div className="text-xs text-muted-foreground text-center">
              This step triggers this workflow
            </div>
          </div>
        ),
      },
      position: { x: 250, y: 0 },
      className: "border-2 rounded-lg shadow-sm bg-white",
    },
    {
      id: "chat",
      type: "default",
      data: {
        label: (
          <div className="flex flex-col items-center p-4">
            <MessageSquare className="h-4 w-4 mb-1 text-primary" />
            <div className="text-sm font-medium mb-1">Chat Step</div>
            <div className="text-xs text-muted-foreground text-center">
              Sends Chat message to your subscribers
            </div>
          </div>
        ),
      },
      position: { x: 250, y: 360 },
      className: "border-2 rounded-lg shadow-sm bg-white",
    },
  ];
}

function getInitialEdges(): Edge[] {
  return [
    {
      id: "trigger-to-inapp",
      source: "trigger",
      target: "in-app",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#94a3b8" }, // text-slate-400
      className: "stroke-2",
    },
    {
      id: "inapp-to-email",
      source: "in-app",
      target: "email",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#94a3b8" },
      className: "stroke-2",
    },
  ];
}

interface TemplateDetailViewProps {
  template: CampaignTemplate;
}

function TemplateDetailView({ template }: TemplateDetailViewProps) {
  const [nodes] = React.useState(getInitialNodes());
  const [edges] = React.useState(getInitialEdges());

  return (
    <div className="grid grid-cols-3 gap-4 h-[calc(100vh-200px)]">
      <div className="relative h-full border rounded-lg bg-[#fafafa] dark:bg-slate-950 col-span-2">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          className="bg-dot-pattern"
          minZoom={0.5}
          maxZoom={1.5}
          defaultZoom={1}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background color="#ccc" variant="dots" gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="overflow-y-auto px-4">
        <CampaignForm template={template} />
      </div>
    </div>
  );
}

export function CampaignTemplatesModal() {
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<CampaignTemplate | null>(null);

  const router = useRouter();
  const [open, setParams] = useQueryStates({
    "create-campaign": parseAsBoolean,
    "open-campaign-template": parseAsBoolean,
  });

  const isOpen = Boolean(open["open-campaign-template"]);

  const handleClose = () => {
    setParams({ "open-campaign-template": null });
    router.push("/campaigns");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[620px] md:max-w-[800px] lg:max-w-6xl">
        <DialogHeader className="bg-background">
          <DialogTitle className="p-2 py-4">
            {selectedTemplate ? (
              <Breadcrumb className="!mt-0">
                <BreadcrumbList>
                  {selectedTemplate && (
                    <>
                      <BreadcrumbItem
                        onClick={() => setSelectedTemplate(null)}
                        className="flex items-center gap-1 hover:cursor-pointer"
                      >
                        Templates
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbPage className="flex items-center gap-1">
                      <div className="flex max-w-[32ch]">
                        {selectedTemplate?.title}
                      </div>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            ) : (
              "Pick a Campaign Template"
            )}
          </DialogTitle>
        </DialogHeader>

        {selectedTemplate ? (
          <TemplateDetailView template={selectedTemplate} />
        ) : (
          <SidebarProvider className="items-start">
            <CampaignSidebar
              selectedType={selectedType}
              onSelectType={(type) => setSelectedType(type || null)}
            />
            <ScrollArea
              className="h-[calc(580px-20px)] bg-background flex w-full flex-col gap-4 text-left"
              hideScrollbar
            >
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card
                      className={cn(
                        "p-6 cursor-pointer hover:border-primary transition-colors flex items-center justify-center gap-3",
                      )}
                      onClick={() => {
                        handleClose();
                        setParams({ "create-campaign": true });
                      }}
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Create Advanced Campaign
                      </span>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">
                      Campaigns used by businesses similar to yours!
                    </h3>
                    <Badge
                      variant="blue"
                      className="bg-green-50 text-green-700"
                    >
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
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-sm">
                              {template.title}
                              {template.comingSoon && (
                                <Badge variant="blue" className="text-xs ml-2">
                                  Coming Soon
                                </Badge>
                              )}
                            </h4>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {template.description}
                            </p>
                          </div>
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <template.icon className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SidebarProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
