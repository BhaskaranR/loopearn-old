"use client";

import { PlanFeatures } from "@/components/plan-features";
import { UpgradePlanButton } from "@/components/upgrade-plan-button";
import { ENTERPRISE_PLAN, PRO_PLAN } from "@/utils/pricing";
import { Badge } from "@loopearn/ui/badge";
import { ToggleGroup } from "@loopearn/ui/toggle-group";
import NumberFlow from "@number-flow/react";
import { useState } from "react";

export function PlanSelector({
  currentPlan,
  slug,
}: {
  currentPlan: string;
  slug: string;
}) {
  const [periodTab, setPeriodTab] = useState<"monthly" | "yearly">("yearly");

  return (
    <div>
      <div className="flex justify-center">
        <ToggleGroup
          options={[
            { value: "monthly", label: "Pay monthly" },
            {
              value: "yearly",
              label: "Pay yearly",
              badge: <Badge variant="blue">Save 10%</Badge>,
            },
          ]}
          selected={periodTab}
          selectAction={(period) =>
            setPeriodTab(period as "monthly" | "yearly")
          }
        />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <PlanCard
          plan={PRO_PLAN}
          period={periodTab}
          slug={slug}
          currentPlan={currentPlan}
        />
        <PlanCard
          plan={ENTERPRISE_PLAN}
          period={periodTab}
          slug={slug}
          currentPlan={currentPlan}
        />
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  period,
  slug,
  currentPlan,
  isPopular,
}: {
  plan: typeof PRO_PLAN;
  period: "monthly" | "yearly";
  slug: string;
  currentPlan: string;
  isPopular?: boolean;
}) {
  const price = plan.price[period];
  const isFreePlan = price === 0;

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium text-gray-900">{plan.name}</h2>
        {isPopular && <Badge variant="blue">Most popular</Badge>}
      </div>
      <div className="mt-2 text-3xl font-medium text-gray-900">
        {price === null ? (
          "Contact us"
        ) : (
          <>
            <NumberFlow
              value={price}
              className="tabular-nums"
              format={{
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }}
              continuous
            />
            <span className="ml-1 text-sm font-medium">
              {isFreePlan ? (
                "Free forever"
              ) : (
                <>
                  per month
                  {period === "yearly" && ", billed yearly"}
                </>
              )}
            </span>
          </>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500">{plan.tagline}</p>
      <PlanFeatures className="mt-4" plan={plan.name} />
      <div className="mt-10 flex grow flex-col justify-end">
        <UpgradePlanButton
          plan={plan.name.toLowerCase()}
          period={period}
          slug={slug}
          currentPlan={currentPlan}
        />
      </div>
    </div>
  );
}
