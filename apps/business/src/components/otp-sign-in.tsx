"use client";

import { verifyOtpAction } from "@/actions/verify-otp-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@loopearn/supabase/client";
import { Button } from "@loopearn/ui/button";
import { cn } from "@loopearn/ui/cn";
import { Form, FormControl, FormField, FormItem } from "@loopearn/ui/form";
import { Input } from "@loopearn/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@loopearn/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@loopearn/ui/use-toast";

async function checkEmailisAttorney(email: string) {
  const response = await fetch(`/api/auth/validateAttorney?email=${email}`);
  const data = await response.json();
  return data.exists;
}

const formSchema = z.object({
  value: z.string().min(1),
});

type Props = {
  className?: string;
};

export function OTPSignIn({ className }: Props) {
  const verifyOtp = useAction(verifyOtpAction);
  const [isLoading, setLoading] = useState(false);
  const [isSent, setSent] = useState(false);
  const [phone, setPhone] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [type, setType] = useState<"email" | "phone" | undefined>();
  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  async function onSubmit({ value }: z.infer<typeof formSchema>) {
    setLoading(true);

    const isPhone = value.startsWith("+");

    setType(isPhone ? "phone" : "email");

    if (isPhone) {
      setPhone(value);
    } else {
      setEmail(value);
    }

    const emailExists = await checkEmailisAttorney(value);
    if (!emailExists) {
      toast({
        title: "Error",
        description: "User does not exist or is not signed up as an business.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const options = isPhone
      ? { phone: value }
      : { email: value, options: { shouldCreateUser: false } };

    await supabase.auth.signInWithOtp(options);

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

        <button
          onClick={() => setSent(false)}
          type="button"
          className="text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("flex flex-col space-y-4", className)}>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter email"
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
