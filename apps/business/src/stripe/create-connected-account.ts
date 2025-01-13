import { stripe } from ".";

export const createConnectedAccount = async ({
  name,
  email,
  country,
}: {
  name: string;
  email: string;
  country: string;
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
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
