import { client as RedisClient } from "@loopearn/kv/client";
import { createClient } from "@loopearn/supabase/admin";
import type Stripe from "stripe";

export async function accountUpdated(event: Stripe.Event) {
  const account = event.data.object as Stripe.Account;

  const { country, payouts_enabled } = account;

  const loopEarnCustomerId = account.metadata.LoopEarnCustomerId;

  const supabase = createClient();
  // need to update the business, stripeConnectId, country, payoutsEnabled for the business
  await supabase
    .from("business")
    .update({
      stripe_connect_id: account.id,
      country,
      payouts_enabled: payouts_enabled,
    })
    .eq("id", account.metadata.LoopEarnCustomerId);

  if (payouts_enabled) {
    await setOnboardingProgress({
      onboardingStep: "completed",
    });
  }
}
