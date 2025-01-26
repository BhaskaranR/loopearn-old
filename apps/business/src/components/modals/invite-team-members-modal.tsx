"use client";

import { inviteTeamMembersAction } from "@/actions/invite-team-members-action";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@loopearn/ui/dialog";
import { useToast } from "@loopearn/ui/use-toast";
import { useAction } from "next-safe-action/hooks";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { InviteTeamMembersForm } from "../forms/invite-team-members-form";

export function InviteTeamMembersModal({ onOpenChange, isOpen }) {
  const { toast } = useToast();

  const inviteMembers = useAction(inviteTeamMembersAction, {
    onSuccess: () => {
      onOpenChange(false);

      toast({
        title: "Successfully invited Team Members.",
        variant: "success",
        duration: 3500,
      });
    },
    onError: () => {
      toast({
        duration: 3500,
        variant: "error",
        title: "Something went wrong please try again.",
      });
    },
  });

  const onSubmit: SubmitHandler<{
    invites?: { role?: "owner" | "member"; email?: string }[];
    redirectTo?: string;
    revalidatePath?: string;
  }> = async (data) => {
    if (data.invites) {
      inviteMembers.execute({
        invites: data.invites.filter((invite) => invite.email !== undefined),
        redirectTo: "/",
      });
    }
  };

  return (
    <DialogContent className="max-w-[455px]">
      <DialogHeader>
        <DialogTitle>Invite Members</DialogTitle>
        <DialogDescription>
          Invite new members by email address.
        </DialogDescription>
      </DialogHeader>
      <InviteTeamMembersForm
        onSubmit={onSubmit}
        isSubmitting={inviteMembers.status === "executing"}
      />
    </DialogContent>
  );
}
