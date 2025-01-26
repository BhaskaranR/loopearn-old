"use server";

import { env } from "@/env.mjs";
import { stripe } from "@/stripe";
import { authActionClient } from "./safe-action";
import { setOnboardingProgress } from "./set-onboarding-progress";

export const createAccountLinkAction = authActionClient
  .metadata({
    name: "create-account-link",
  })
  .action(async ({ ctx }) => {
    const { user } = ctx;

    if (!user.business.stripe_connect_id) {
      throw new Error("Business does not have a Stripe Connect account.");
    }

    await setOnboardingProgress({
      onboardingStep: "stripe-pending",
    });

    // const { url } = user.business.payouts_enabled
    //   ? await stripe.accounts.createLoginLink(user.business.stripe_connect_id)
    //   : await stripe.accountLinks.create({
    //       account: user.business.stripe_connect_id,
    //       refresh_url: `${env.NEXT_PUBLIC_BUSINESS_DOMAIN}`,
    //       return_url: `${env.NEXT_PUBLIC_BUSINESS_DOMAIN}`,
    //       type: "account_onboarding",
    //       collect: "eventually_due",
    //     });

    const { url } = await stripe.accountLinks.create({
      account: user.business.stripe_connect_id,
      refresh_url: `${env.NEXT_PUBLIC_BUSINESS_DOMAIN}`,
      return_url: `${env.NEXT_PUBLIC_BUSINESS_DOMAIN}`,
      type: "account_onboarding",
      collect: "eventually_due",
    });
    return {
      url,
    };
  });
