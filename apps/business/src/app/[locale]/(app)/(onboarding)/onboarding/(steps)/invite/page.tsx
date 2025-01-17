import { InviteTeamMembersForm } from "@/components/forms/invite-team-members-form";
import { Users } from "@loopearn/ui/icons";
import { StepPage } from "../step-page";

export default function Invite() {
  return (
    <StepPage
      icon={Users}
      title="Invite teammates"
      description="Invite teammates to join your workspace. Invitations will be valid for 14 days."
      paidPlanRequired
    >
      {/* <InviteTeamMembersForm
        onSubmit={onSubmit}
        isSubmitting={inviteMembers.status === "executing"}
      /> */}
    </StepPage>
  );
}
