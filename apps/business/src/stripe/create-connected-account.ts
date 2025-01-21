import { stripe } from ".";

export const createConnectedAccount = async ({
  id,
  name,
  email,
  country,
  description,
}: {
  id: string;
  name: string;
  email: string;
  country: string;
  description: string;
}) => {
  try {
    return await stripe.accounts.create({
      type: "express",
      business_type: "company",
      email,
      country,
      company: {
        name: name,
      },
      business_profile: {
        product_description: description,
      },
      capabilities: {
        transfers: {
          requested: true,
        },
        ...(country === "US" && {
          card_payments: {
            requested: true,
          },
        }),
      },
      ...(country !== "US" && {
        tos_acceptance: { service_agreement: "recipient" },
      }),
      metadata: {
        LoopEarnCustomerId: id,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
