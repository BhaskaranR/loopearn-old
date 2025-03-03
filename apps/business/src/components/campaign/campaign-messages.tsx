import React from "react";

export interface CampaignSuccessMessageProps {
  name: string;
  type: string;
  action_type: string;
  reward_value: number;
  reward_unit: string;
  reward_type: string;
  start_date?: string;
  end_date?: string;
}

export function CampaignSuccessMessage({
  name,
  type,
  action_type,
  reward_value,
  reward_unit,
  reward_type,
  start_date,
  end_date,
}: CampaignSuccessMessageProps) {
  return (
    <div className="space-y-2">
      <p>✅ I've created a campaign with the following details:</p>
      <ul className="list-none space-y-1">
        <li>• Name: {name}</li>
        <li>• Type: {type}</li>
        <li>• Action: {action_type}</li>
        <li>
          • Reward: {reward_value} {reward_unit} {reward_type}
        </li>
        {start_date && (
          <li>
            • Duration: {new Date(start_date).toLocaleDateString()} to{" "}
            {new Date(end_date || "").toLocaleDateString()}
          </li>
        )}
      </ul>
      <p className="mt-4">
        Is there anything else you'd like me to help you with?
      </p>
    </div>
  );
}

export interface CampaignErrorMessageProps {
  error: string;
}

export function CampaignErrorMessage({ error }: CampaignErrorMessageProps) {
  return (
    <div className="text-red-600">
      <p>❌ {error}</p>
      <p>
        Please try again with more specific details about the campaign you want
        to create.
      </p>
    </div>
  );
}
