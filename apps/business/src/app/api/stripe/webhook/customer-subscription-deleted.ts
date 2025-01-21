import { createClient } from "@loopearn/supabase/client";
import type Stripe from "stripe";

export async function customerSubscriptionDeleted(event: Stripe.Event) {
  const subscriptionDeleted = event.data.object as Stripe.Subscription;

  const stripeId = subscriptionDeleted.customer.toString();

  const supabase = createClient();
  await supabase
    .from("business")
    .update({
      stripe_id: null,
      plan: "free",
    })
    .eq("stripe_id", stripeId);
}
