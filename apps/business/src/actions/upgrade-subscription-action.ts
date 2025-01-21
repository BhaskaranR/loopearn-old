"use server";

import { env } from "@/env.mjs";
import { stripe } from "@/stripe";
import { getBusinessById } from "@loopearn/supabase/cached-queries";
import { revalidateTag } from "next/cache";
import type Stripe from "stripe";
import { authActionClient } from "./safe-action";
import { upgradePlanSchema } from "./schema";

export const upgradeSubscriptionAction = authActionClient
  .schema(upgradePlanSchema)
  .metadata({
    name: "upgrade-subscription",
  })
  .action(
    async ({
      parsedInput: data,
      ctx: { user, supabase },
    }): Promise<string | Stripe.Checkout.Session> => {
      const businessId = user.business_id;
      const { plan, period, baseUrl, onboarding } = data;

      // get business and check if has stripe id
      const { data: business, error } = await getBusinessById(businessId);

      const prices = await stripe.prices.list({
        lookup_keys: [`${plan}_${period}`],
      });

      const activeSubscription = business.stripe_id
        ? await stripe.subscriptions
            .list({
              customer: business.stripe_id,
              status: "active",
            })
            .then((res) => res.data[0])
        : null;

      if (business.stripe_id && activeSubscription) {
        const { url } = await stripe.billingPortal.sessions.create({
          customer: business.stripe_id,
          return_url: baseUrl,
          flow_data: {
            type: "subscription_update_confirm",
            subscription_update_confirm: {
              subscription: activeSubscription.id,
              items: [
                {
                  id: activeSubscription.items.data[0].id,
                  quantity: 1,
                  price: prices.data[0].id,
                },
              ],
            },
          },
        });
        return url;
      }
      try {
        // For both new users and users with canceled subscriptions
        const stripeSession = await stripe.checkout.sessions.create({
          ...(business.stripe_id
            ? {
                customer: business.stripe_id,
                customer_update: {
                  name: "auto",
                  address: "auto",
                },
              }
            : {
                customer_email: user.username,
              }),
          billing_address_collection: "required",
          success_url: `${env.NEXT_PUBLIC_BUSINESS_DOMAIN}?${onboarding ? "onboarded" : "upgraded"}=true&plan=${plan}&period=${period}`,
          cancel_url: baseUrl,
          line_items: [{ price: prices.data[0].id, quantity: 1 }],
          discounts: [
            {
              coupon: "HBfvInjT",
            },
          ],
          automatic_tax: {
            enabled: true,
          },
          tax_id_collection: {
            enabled: true,
          },
          mode: "subscription",
          client_reference_id: businessId,
          metadata: {
            LoopEarnCustomerId: user.id,
          },
        });
        return stripeSession;
      } catch (error) {
        if (error.code === "stripe_tax_inactive") {
          console.error(
            "Stripe Tax is inactive. Please activate it in your Stripe account settings.",
          );
          // Handle the error appropriately, e.g., notify the user or log it
          throw new Error(
            "Unable to create a subscription session due to inactive Stripe Tax.",
          );
        } else {
          console.error("An unexpected error occurred:", error);
          throw error; // Re-throw unexpected errors
        }
      }
    },
  );
