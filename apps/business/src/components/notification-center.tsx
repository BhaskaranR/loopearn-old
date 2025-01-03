"use client";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@loopearn/ui/button";
import { Icons } from "@loopearn/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@loopearn/ui/popover";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@loopearn/ui/tabs";
import Link from "next/link";
import { useEffect, useState } from "react";

function EmptyState({ description }: { description: string }) {
  return (
    <div className="h-[460px] flex items-center justify-center flex-col space-y-4">
      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
        <Icons.Inbox className="w-6 h-6" />
      </div>
      <p className="text-[#606060] text-sm">{description}</p>
    </div>
  );
}

export function NotificationCenter() {
  const [isOpen, setOpen] = useState(false);
  const {
    hasUnseenNotificaitons,
    notifications,
    markMessageAsRead,
    markAllMessagesAsSeen,
    markAllMessagesAsRead,
  } = useNotifications();

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  );

  const archivedNotifications = notifications.filter(
    (notification) =>
      notification.read && notification.payload.type !== "business-invite",
  );

  useEffect(() => {
    if (isOpen && hasUnseenNotificaitons) {
      markAllMessagesAsSeen();
    }
  }, [hasUnseenNotificaitons, isOpen]);

  return (
    <Popover onOpenChange={setOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 flex items-center relative"
        >
          {hasUnseenNotificaitons && (
            <div className="w-1.5 h-1.5 bg-[#FFD02B] rounded-full absolute top-0 right-0" />
          )}
          <Icons.Notifications size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="h-[535px] w-screen md:w-[400px] p-0 overflow-hidden relative"
        align="end"
        sideOffset={10}
      >
        <Tabs defaultValue="inbox">
          <TabsList className="w-full justify-start bg-transparent border-b-[1px] rounded-none py-6">
            <TabsTrigger value="inbox" className="font-normal">
              Inbox
            </TabsTrigger>
            <TabsTrigger value="archive" className="font-normal">
              Archive
            </TabsTrigger>
          </TabsList>

          <Link
            href="/settings/notifications"
            className="absolute right-[11px] top-1.5"
          >
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-ransparent hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <Icons.Settings className="text-[#606060]" size={16} />
            </Button>
          </Link>

          <TabsContent value="inbox" className="relative mt-0">
            {!unreadNotifications.length && (
              <EmptyState description="No new notifications" />
            )}

            {unreadNotifications.length > 0 && (
              <ScrollArea className="pb-12 h-[485px]">
                <div className="divide-y">
                  <div className="flex items-center justify-center h-full">
                    <p>No new notifications</p>
                  </div>
                </div>
              </ScrollArea>
            )}

            {/* {unreadNotifications.length > 0 && (
              <div className="h-12 w-full absolute bottom-0 flex items-center justify-center border-t-[1px]">
                <Button
                  variant="secondary"
                  className="bg-transparent"
                  onClick={markAllMessagesAsRead}
                >
                  Archive all
                </Button>
              </div>
            )} */}
          </TabsContent>

          <TabsContent value="archive" className="mt-0">
            {!archivedNotifications.length && (
              <EmptyState description="Nothing in the archive" />
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
