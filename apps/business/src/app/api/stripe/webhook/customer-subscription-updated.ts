import { getPlanFromPriceId } from "@/utils/pricing";
import { createClient } from "@loopearn/supabase/admin";
import type Stripe from "stripe";

export async function customerSubscriptionUpdated(event: Stripe.Event) {
  const subscriptionUpdated = event.data.object as Stripe.Subscription;
  const priceId = subscriptionUpdated.items.data[0].price.id;
  const stripeId = subscriptionUpdated.customer.toString();
  const plan = getPlanFromPriceId(priceId);

  if (!plan) {
    console.error({
      message: `Invalid price ID in customer.subscription.updated event: ${priceId}`,
      type: "errors",
    });
    return;
  }

  console.log("Updating business plan to", plan.name);
  const supabase = createClient();
  await supabase
    .from("business")
    .update({
      plan: plan.name,
    })
    .eq("stripe_id", stripeId);
}
