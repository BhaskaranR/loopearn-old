"use client";

import type { Database } from "@loopearn/supabase/db";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@loopearn/ui/alert-dialog";
import { Badge } from "@loopearn/ui/badge";
import { Button } from "@loopearn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@loopearn/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { Loader2 } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

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
    cell: ({ row, table }) => {
      return formatDate(row.original.start_date, "MMM d, yyyy");
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row, table }) => {
      return formatDate(row.original.end_date, "MMM d, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={`/campaigns/create/${row.original.id}`}>
                  Set live on LoopEarn
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/campaigns/create/workflow/${row.original.id}`}
                  className="w-full"
                >
                  Edit
                </Link>
              </DropdownMenuItem>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive w-full">
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                transaction.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  table.options.meta?.deleteCampaign({
                    id: row.original.id,
                  });
                }}
              >
                {table.options.meta?.deleteCampaign?.status === "executing" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirm"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
