"use client";
import { type SignUpFormValues, signUpSchema } from "@/actions/schema";
import { verifyOtpAction } from "@/actions/verify-otp-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@loopearn/supabase/client";
import { Button } from "@loopearn/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@loopearn/ui/card";
import { cn } from "@loopearn/ui/cn";
import { Form, FormControl, FormField, FormItem } from "@loopearn/ui/form";
import { Input } from "@loopearn/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@loopearn/ui/input-otp";
import { Label } from "@loopearn/ui/label";
import { useToast } from "@loopearn/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { memo } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

async function checkEmailUnique(email: string) {
  const response = await fetch(`/api/auth/validate?email=${email}`);
  const data = await response.json();
  return !data.exists;
}

// extend yup with password validation
const SignUpForm = ({
  referralCode,
  className,
}: { referralCode?: string; className?: string }) => {
  const verifyOtp = useAction(verifyOtpAction);
  const { toast } = useToast();
  const [type, setType] = useState<"email" | "phone">();
  const [isLoading, setLoading] = useState(false);
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState<string | null>(null);
  const [isSent, setSent] = useState(false);
  const supabase = createClient();
  // nuqs get referral code

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof signUpSchema>) {
    setLoading(true);
    setType("email");

    const isUnique = await checkEmailUnique(formData.email);
    if (!isUnique) {
      toast({
        title: "Error",
        description: "Email is already in use.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setEmail(formData.email);

    const { data, error } = await supabase.auth.signInWithOtp({
      email: formData.email,
      options: {
        data: {
          emailRedirectTo: "https://app.relistex.com",
          full_name: `${formData.firstName} ${formData.lastName}`,
          referral_code: referralCode,
        },
        shouldCreateUser: true,
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
    <div className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              id="first-name"
                              placeholder="Max"
                              {...field}
                              required
                            />
                          </FormControl>
                          {error && (
                            <p className="text-red-500 text-sm mt-1">
                              {error.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              id="last-name"
                              placeholder="Robinson"
                              {...field}
                              required
                            />
                          </FormControl>
                          {error && (
                            <p className="text-red-500 text-sm mt-1">
                              {error.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Your email"
                            {...field}
                            required
                          />
                        </FormControl>
                        {error && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
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
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default memo(SignUpForm);
