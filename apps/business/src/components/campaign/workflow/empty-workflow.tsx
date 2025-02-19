"use client";

import { LucidePlusCircle } from "lucide-react";

interface EmptyWorkflowProps {
  className?: string;
}

export function EmptyWorkflow({ className }: EmptyWorkflowProps) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md mx-auto p-6">
        <div className="bg-muted/30 rounded-full p-4 w-fit mx-auto">
          <LucidePlusCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Start Building Your Workflow</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop activities from the sidebar to create your automation
          workflow. Start with a trigger, add control steps, and finish with
          actions.
        </p>
      </div>
    </div>
  );
}
