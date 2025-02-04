"use client";
import { type SignUpFormValues, signUpSchema } from "@/actions/schema";
import { verifyOtpAction } from "@/actions/verify-otp-action";
import { Logo } from "@/components/logo";
import { SystemBanner } from "@/components/system-banner";
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

interface IProps {
  searchParams?: {
    return_to: string;
  };
}

export default function SignupPage({ searchParams }: IProps) {
  const queryString = new URLSearchParams(searchParams).toString();
  const loginUrl = `/login${queryString ? `?${queryString}` : ""}`;

  let inviteCode = "";
  if (searchParams?.return_to?.startsWith("teams/invite/")) {
    inviteCode = searchParams.return_to.split("teams/invite/")[1];
  }

  const verifyOtp = useAction(verifyOtpAction);
  const { toast } = useToast();
  const [type, setType] = useState<"email" | "phone">();
  const [isLoading, setLoading] = useState(false);
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState<string | null>(null);
  const [isSent, setSent] = useState(false);
  const [enterCodeManually, setEnterCodeManually] = useState(false);
  const [shouldCreateUser, setShouldCreateUser] = useState(true);
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
        },
        shouldCreateUser: shouldCreateUser,
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
      <div>
        <header className="w-full fixed left-0 right-0">
          <div className="ml-5 mt-4 md:ml-10 md:mt-10">
            <Link
              href="https://loopearn.com"
              className="inline-flex items-center"
            >
              <Logo className="font-semibold h-8 w-auto" />
            </Link>
          </div>
        </header>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex items-center space-y-6">
              <h1 className="text-2xl font-medium">Check your email</h1>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <p className="text-center text-muted-foreground">
                We&apos;ve sent you a temporary login link.
                <br />
                Please check your inbox at{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </p>

              {enterCodeManually ? (
                <div className={cn("flex flex-col space-y-4 items-center")}>
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
                      onClick={() => {
                        setSent(false);
                        setShouldCreateUser(false);
                      }}
                      type="button"
                      className="text-sm text-primary underline font-medium"
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEnterCodeManually(true);
                  }}
                >
                  Enter code manually
                </Button>
              )}
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to log in
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <header className="w-full fixed left-0 right-0">
          <div className="ml-5 mt-4 md:ml-10 md:mt-10">
            <Link
              href="https://loopearn.com"
              className="inline-flex items-center"
            >
              <Logo className="font-semibold h-8 w-auto" />
            </Link>
          </div>
        </header>

        <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
          <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
            <div className="flex w-full flex-col relative">
              <div className="pointer-events-auto my-6 flex flex-col">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Create an account
                    </h1>
                  </div>
                  <div className="flex flex-col gap-5">
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
                                    <Label htmlFor="first-name">
                                      First name
                                    </Label>
                                    <FormField
                                      control={form.control}
                                      name="firstName"
                                      render={({
                                        field,
                                        fieldState: { error },
                                      }) => (
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
                                      render={({
                                        field,
                                        fieldState: { error },
                                      }) => (
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
                                    render={({
                                      field,
                                      fieldState: { error },
                                    }) => (
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
                            </CardContent>
                          </Card>
                        </form>
                      </Form>
                    </div>
                  </div>

                  <div className="my-8 self-center text-sm">
                    <span className="text-foreground-light">
                      Have an account?
                    </span>{" "}
                    <Link
                      href={loginUrl}
                      className="hover:text-foreground-light text-foreground underline transition"
                    >
                      Sign in now
                    </Link>
                  </div>

                  <p className="text-xs text-[#878787]">
                    By clicking Sign Up, you acknowledge that you have read and
                    agree to Loopearn&apos;s{" "}
                    <a href="https://loopearn.com/terms" className="underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="https://loopearn.com/policy" className="underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
