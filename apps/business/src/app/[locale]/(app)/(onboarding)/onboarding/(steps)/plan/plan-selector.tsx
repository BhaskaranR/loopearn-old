"use client";

import { PlanFeatures } from "@/components/plan-features";
import { UpgradePlanButton } from "@/components/upgrade-plan-button";
import { PRO_PLAN, SELF_SERVE_PAID_PLANS } from "@/utils/pricing";
import { Badge } from "@loopearn/ui/badge";
import { ToggleGroup } from "@loopearn/ui/toggle-group";
import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

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
              badge: <Badge variant="blue">Save 20%</Badge>,
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
          name="Pro"
          plans={[PRO_PLAN]}
          period={periodTab}
          slug={slug}
          currentPlan={currentPlan}
        />
        <PlanCard
          name="Business"
          currentPlan={currentPlan}
          slug={slug}
          plans={SELF_SERVE_PAID_PLANS.filter(({ name }) =>
            name.startsWith("Business"),
          )}
          period={periodTab}
        />
      </div>
    </div>
  );
}

function PlanCard({
  name,
  plans,
  period,
  slug,
  currentPlan,
}: {
  name: string;
  plans: (typeof SELF_SERVE_PAID_PLANS)[number][];
  period: "monthly" | "yearly";
  slug: string;
  currentPlan: string;
}) {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const selectedPlan = plans[selectedPlanIndex];

  useEffect(() => {
    if (currentPlan?.startsWith("business")) {
      const idx = plans.findIndex((p) => p.name.toLowerCase() === currentPlan);
      if (idx !== -1) {
        setSelectedPlanIndex(idx);
      }
    }
  }, [currentPlan]);

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium text-gray-900">{name}</h2>
        {name === "Pro" && <Badge variant="blue">Most popular</Badge>}
      </div>
      <div className="mt-2 text-3xl font-medium text-gray-900">
        <NumberFlow
          value={selectedPlan.price[period]!}
          className="tabular-nums"
          format={{
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }}
          continuous
        />
        <span className="ml-1 text-sm font-medium">
          per month
          {period === "yearly" && ", billed yearly"}
        </span>
      </div>
      {plans.length > 1 && (
        <div className="mt-4">
          <ToggleGroup
            className="grid grid-cols-4"
            style={{ gridTemplateColumns: "1fr ".repeat(plans.length) }}
            options={plans.map((plan) => ({
              value: plan.name,
              label: plan.name.replace(name, "").trim() || "Basic",
            }))}
            selected={selectedPlan.name}
            selectAction={(name) =>
              setSelectedPlanIndex(plans.findIndex((p) => p.name === name))
            }
          />
        </div>
      )}
      <PlanFeatures className="mt-4" plan={selectedPlan.name} />
      <div className="mt-10 flex grow flex-col justify-end">
        <UpgradePlanButton
          plan={selectedPlan.name.toLowerCase()}
          period={period}
          slug={slug}
          currentPlan={currentPlan}
        />
      </div>
    </div>
  );
}
