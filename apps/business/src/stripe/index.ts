import { env } from "@/env.mjs";
import Stripe from "stripe";

export const stripe = new Stripe(`${env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2024-12-18.acacia",
  appInfo: {
    name: "LoopEarn",
    version: "0.1.0",
  },
});
