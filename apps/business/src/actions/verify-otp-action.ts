"use server";

import { Cookies } from "@/utils/constants";
import { createClient } from "@loopearn/supabase/server";
import { addYears } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { actionClient } from "./safe-action";
import { verifyOtpSchema } from "./schema";

export const verifyOtpAction = actionClient
  .schema(verifyOtpSchema)
  .action(async ({ parsedInput: { type, email, token, phone } }) => {
    const supabase = createClient();

    const options =
      type === "email"
        ? {
            email: email!,
            token,
            type: "email" as const,
          }
        : {
            phone: phone!,
            token,
            type: "sms" as const,
          };

    const { data, error } = await supabase.auth.verifyOtp(options);
    console.log(data, error);
    cookies().set(Cookies.PreferredSignInProvider, "otp", {
      expires: addYears(new Date(), 1),
    });

    redirect("/");
  });
