"use client";

import { createAccountLinkAction } from "@/actions/create-account-link";
import { Button, type ButtonProps } from "@loopearn/ui/button";
import { LoadingSpinner } from "@loopearn/ui/loading-spinner";
import { useToast } from "@loopearn/ui/use-toast";
import { useAction } from "next-safe-action/hooks";

export default function StripeConnectButton(
  props: ButtonProps & { text: string },
) {
  const { toast } = useToast();
  const { executeAsync, isExecuting } = useAction(createAccountLinkAction, {
    onSuccess: ({ data }) => {
      if (!data?.url) {
        toast({
          title: "Unable to create account link. Please contact support.",
          variant: "destructive",
        });
        return;
      }
      window.open(data.url, "_blank");
    },
    onError: ({ error }) => {
      toast({
        title: "Unable to create account link. Please contact support.",
        variant: "destructive",
      });
    },
  });

  return (
    <Button onClick={() => executeAsync()} {...props}>
      {isExecuting ? <LoadingSpinner /> : props.text}
    </Button>
  );
}
