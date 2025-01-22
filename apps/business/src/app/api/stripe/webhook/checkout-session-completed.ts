import { stripe } from "@/stripe";
import { getPlanFromPriceId } from "@/utils/pricing";
import { client as RedisClient } from "@loopearn/kv/client";
import { createClient } from "@loopearn/supabase/admin";
import type Stripe from "stripe";

export async function checkoutSessionCompleted(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session;

  if (checkoutSession.mode === "setup") {
    return;
  }

  if (
    checkoutSession.client_reference_id === null ||
    checkoutSession.customer === null
  ) {
    console.error("Missing items in Stripe webhook callback");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    checkoutSession.subscription as string,
  );
  const priceId = subscription.items.data[0].price.id;

  const plan = getPlanFromPriceId(priceId);

  if (!plan) {
    console.error(
      `Invalid price ID in checkout.session.completed event: ${priceId}`,
    );
    return;
  }

  const stripeId = checkoutSession.customer.toString();
  const workspaceId = checkoutSession.client_reference_id;
  const loopEarnCustomerId = checkoutSession.metadata.LoopEarnCustomerId;
  const planName = plan.name.toLowerCase();

  // when the workspace subscribes to a plan, set their stripe customer ID
  // in the database for easy identification in future webhook events
  // also update the billingCycleStart to today's date

  // supabase update business table with stripeId and plan
  const supabase = createClient();
  await supabase
    .from("business")
    .update({
      stripe_id: stripeId,
      plan: planName,
    })
    .eq("id", workspaceId);

  // complete onboarding step for loopEarnCustomerId
  await RedisClient.set(`onboarding-step:${loopEarnCustomerId}`, "completed");
}
