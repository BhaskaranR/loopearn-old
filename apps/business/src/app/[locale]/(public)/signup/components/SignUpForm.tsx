"use client";
import { type SignUpFormValues, signUpSchema } from "@/actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@loopearn/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@loopearn/ui/alert";
import { Button } from "@loopearn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@loopearn/ui/card";
import { Form, FormControl, FormField, FormItem } from "@loopearn/ui/form";
import { Input } from "@loopearn/ui/input";
import { Label } from "@loopearn/ui/label";
import { useToast } from "@loopearn/ui/use-toast";
import { Loader2 } from "lucide-react";
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
const SignUpForm = ({ referralCode }: { referralCode?: string }) => {
  const { toast } = useToast();
  const [type, setType] = useState<"email" | "phone">();
  const [isLoading, setLoading] = useState(false);
  const [isSent, setSent] = useState(false);
  const supabase = createClient();
  // nuqs get referral code

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
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

    const { data, error } = await supabase.auth.signInWithOtp({
      email: formData.email,
      options: {
        data: {
          emailRedirectTo: "https://business.loopearn.com",
          full_name: `${formData.firstName} ${formData.lastName}`,
          companyName: formData.companyName,
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

  if (isSent) {
    return (
      <div className="relative">
        <div
          className={`absolute top-0 w-full delay-300 duration-500 ${
            isSent ? "opacity-100" : "opacity-0"
          }`}
        >
          <Alert className="w-full" title="Check your email to confirm">
            <AlertTitle> Check your email to confirm</AlertTitle>
            <AlertDescription>
              {`You've successfully signed up. Please check your email to confirm your account before
            signing in to the LoopEarn`}
            </AlertDescription>
          </Alert>
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
                  <Label htmlFor="business-name">Business name</Label>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="business-name"
                            placeholder="Your business name"
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
