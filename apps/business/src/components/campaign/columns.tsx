"use client";

import type { Database } from "@loopearn/supabase/db";
import { Badge } from "@loopearn/ui/badge";
import { Button } from "@loopearn/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<
  Database["public"]["Tables"]["campaigns"]["Row"]
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "is_repeatable",
    header: "Repeatable",
    cell: ({ row }) => {
      const isRepeatable = row.getValue("is_repeatable") as boolean;
      return (
        <Badge variant={isRepeatable ? "blue" : "gray"}>
          {isRepeatable ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "blue" : "gray"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
  },
  {
    accessorKey: "end_date",
    header: "End Date",
  },
  {
    id: "actions",
    cell: () => {
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    },
  },
];
