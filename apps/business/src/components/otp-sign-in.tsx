"use client";

import { verifyOtpAction } from "@/actions/verify-otp-action";
import { env } from "@/env.mjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@loopearn/supabase/client";

import { Button } from "@loopearn/ui/button";
import { cn } from "@loopearn/ui/cn";
import { Form, FormControl, FormField, FormItem } from "@loopearn/ui/form";
import { Input } from "@loopearn/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@loopearn/ui/input-otp";
import { useToast } from "@loopearn/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function checkEmailisBusiness(email: string) {
  const response = await fetch(`/api/auth/validate?email=${email}`);
  const data = await response.json();
  return data.exists;
}

const formSchema = z.object({
  email: z.string().email(),
});

type Props = {
  className?: string;
  inviteCode?: string;
  email?: string;
};

export function OTPSignIn({
  className,
  inviteCode,
  email: defaultEmail,
}: Props) {
  const verifyOtp = useAction(verifyOtpAction);

  const [isLoading, setLoading] = useState(false);
  const [isSent, setSent] = useState(false);
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState<string | null>(defaultEmail);
  const [type, setType] = useState<"email" | "phone">("email");
  const supabase = createClient();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: z.infer<typeof formSchema>) {
    setLoading(true);

    setEmail(email);
    const emailExists = await checkEmailisBusiness(email);
    if (!emailExists) {
      toast({
        title: "Error",
        description: "User does not exist.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          emailRedirectTo: env.NEXT_PUBLIC_BUSINESS_DOMAIN,
        },
        shouldCreateUser: false,
      },
    });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  async function onComplete(token: string) {
    if (type) {
      verifyOtp.execute({
        type,
        token,
        phone,
        email,
      });
    }
  }
  if (isSent) {
    return (
      <div className={cn("flex flex-col space-y-4 items-center", className)}>
        <InputOTP
          maxLength={6}
          autoFocus
          onComplete={onComplete}
          disabled={verifyOtp.status === "executing"}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot
                  key={index.toString()}
                  {...slot}
                  className="w-[62px] h-[62px]"
                />
              ))}
            </InputOTPGroup>
          )}
        />

        <div className="flex space-x-2">
          <span className="text-sm text-[#878787]">
            Didn't receive the email?
          </span>
          <button
            onClick={() => setSent(false)}
            type="button"
            className="text-sm text-primary underline font-medium"
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("flex flex-col space-y-4", className)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    {...field}
                    autoCapitalize="false"
                    autoCorrect="false"
                    spellCheck="false"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="active:scale-[0.98] bg-primary px-6 py-4 text-secondary font-medium flex space-x-2 h-[40px] w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
