"use client";

import { Button } from "@loopearn/ui/button";
import { Input } from "@loopearn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loopearn/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@loopearn/ui/sheet";
import { SidebarInset, SidebarProvider } from "@loopearn/ui/sidebar";
import {
  ArrowLeft,
  Clock,
  Crown,
  Mail,
  MessageSquare,
  MinusCircle,
  Phone,
  Play,
  PlusCircle,
  Settings,
  Star,
  Tag,
  Webhook,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WorkflowCanvas } from "../../components/workflow/workflow-canvas";
import { WorkFlowSidebar } from "../../components/workflow/workflow-sidebar";
export default function WorkflowPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();

  const sidebarItems = [
    {
      icon: <Webhook className="h-4 w-4" />,
      label: "Send Webhook",
      color: "bg-green-600",
    },
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Send Email",
      color: "bg-green-600",
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: "Send Mobile Push",
      color: "bg-green-600",
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Send Web Message",
      color: "bg-green-600",
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "SMS",
      color: "bg-green-600/50",
    },
    {
      icon: <Star className="h-4 w-4" />,
      label: "Reward a Coupon",
      color: "bg-green-600",
    },
    {
      icon: <Crown className="h-4 w-4" />,
      label: "Reward a Badge",
      color: "bg-green-600",
    },
    {
      icon: <PlusCircle className="h-4 w-4" />,
      label: "Add points",
      color: "bg-green-600",
    },
    {
      icon: <MinusCircle className="h-4 w-4" />,
      label: "Deduct Points",
      color: "bg-green-600",
    },
    {
      icon: <Tag className="h-4 w-4" />,
      label: "Add Tag",
      color: "bg-green-600",
    },
    {
      icon: <Tag className="h-4 w-4" />,
      label: "Remove Tag",
      color: "bg-green-600",
    },
  ];

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex flex-col">
        {/* Header */}
        <header className="border-b bg-background p-4">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/campaigns/create")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">Advanced Campaign</h1>
            </div>
            <div className="flex-1 max-w-[400px] mx-4">
              <Input placeholder="Workflow Name" className="h-9 text-base" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Close
              </Button>
              <Button variant="outline" size="sm">
                Save as draft
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Execute
              </Button>
            </div>
          </div>
        </header>

        {/* Sidebar and Main Content */}
        <SidebarInset className="p-0">
          <div className="flex-1 flex">
            <WorkFlowSidebar className="absolute top-0 mt-4" />
            <div className="flex-1 bg-dot-pattern">
              <WorkflowCanvas />
            </div>

            {/* Right Sidebar */}
          </div>
        </SidebarInset>

        {/* Coupon Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Reward a Coupon</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coupon Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free-product">Free Product</SelectItem>
                      <SelectItem value="free-shipping">
                        Free Shipping
                      </SelectItem>
                      <SelectItem value="fixed-amount">
                        Fixed Amount-based Discount
                      </SelectItem>
                      <SelectItem value="percentage">
                        Percentage-based Discount
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
}
