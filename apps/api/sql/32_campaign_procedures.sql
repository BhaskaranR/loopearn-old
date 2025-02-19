-- Create Campaign Function
CREATE OR REPLACE FUNCTION create_campaign(
  campaign_data jsonb,
  reward_data jsonb
) RETURNS "campaigns"
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_campaign "campaigns";
BEGIN
  -- Insert campaign
  INSERT INTO "campaigns" (
    business_id,
    name,
    description,
    type,
    is_repeatable,
    max_achievement,
    min_tier,
    visibility,
    status,
    start_date,
    end_date,
    is_live_on_marketplace
  )
  SELECT
    (campaign_data->>'business_id')::uuid,
    campaign_data->>'name',
    campaign_data->>'description',
    campaign_data->>'type',
    (campaign_data->>'is_repeatable')::boolean,
    (campaign_data->>'max_achievement')::int,
    (campaign_data->>'min_tier')::int,
    campaign_data->>'visibility',
    campaign_data->>'status',
    (campaign_data->>'start_date')::timestamp,
    (campaign_data->>'end_date')::timestamp,
    (campaign_data->>'is_live_on_marketplace')::boolean
  RETURNING * INTO new_campaign;

  -- Insert reward
  INSERT INTO "campaign_action_rewards" (
    campaign_id,
    icon_url,
    redirection_button_text,
    redirection_button_link,
    reward_type,
    reward_value,
    reward_unit,
    action_type,
    action_details,
    uses_per_customer,
    minimum_purchase_amount,
    expires_after
  )
  SELECT
    new_campaign.id,
    reward_data->>'icon_url',
    reward_data->>'redirection_button_text',
    reward_data->>'redirection_button_link',
    reward_data->>'reward_type',
    (reward_data->>'reward_value')::int,
    reward_data->>'reward_unit',
    reward_data->>'action_type',
    reward_data->>'action_details',
    (reward_data->>'uses_per_customer')::int,
    (reward_data->>'minimum_purchase_amount')::int,
    (reward_data->>'expires_after')::int;

  RETURN new_campaign;
END;
$$;

-- Update Campaign Function
CREATE OR REPLACE FUNCTION update_campaign(
  campaign_id uuid,
  campaign_data jsonb,
  reward_data jsonb
) RETURNS "campaigns"
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  updated_campaign "campaigns";
BEGIN
  -- Update campaign if data provided
  IF campaign_data IS NOT NULL AND campaign_data != '{}'::jsonb THEN
    UPDATE "campaigns"
    SET
      name = COALESCE((campaign_data->>'name'), name),
      description = COALESCE((campaign_data->>'description'), description),
      type = COALESCE((campaign_data->>'type'), type),
      is_repeatable = COALESCE((campaign_data->>'is_repeatable')::boolean, is_repeatable),
      max_achievement = COALESCE((campaign_data->>'max_achievement')::int, max_achievement),
      min_tier = COALESCE((campaign_data->>'min_tier')::int, min_tier),
      visibility = COALESCE((campaign_data->>'visibility'), visibility),
      status = COALESCE((campaign_data->>'status'), status),
      start_date = COALESCE((campaign_data->>'start_date')::timestamp, start_date),
      end_date = COALESCE((campaign_data->>'end_date')::timestamp, end_date),
      is_live_on_marketplace = COALESCE((campaign_data->>'is_live_on_marketplace')::boolean, is_live_on_marketplace)
    WHERE id = campaign_id
    RETURNING * INTO updated_campaign;
  END IF;

  -- Update reward if data provided
  IF reward_data IS NOT NULL AND reward_data != '{}'::jsonb THEN
    UPDATE "campaign_action_rewards"
    SET
      icon_url = COALESCE((reward_data->>'icon_url'), icon_url),
      redirection_button_text = COALESCE((reward_data->>'redirection_button_text'), redirection_button_text),
      redirection_button_link = COALESCE((reward_data->>'redirection_button_link'), redirection_button_link),
      reward_type = COALESCE((reward_data->>'reward_type'), reward_type),
      reward_value = COALESCE((reward_data->>'reward_value')::int, reward_value),
      reward_unit = COALESCE((reward_data->>'reward_unit'), reward_unit),
      action_type = COALESCE((reward_data->>'action_type'), action_type),
      action_details = COALESCE((reward_data->>'action_details'), action_details),
      uses_per_customer = COALESCE((reward_data->>'uses_per_customer')::int, uses_per_customer),
      minimum_purchase_amount = COALESCE((reward_data->>'minimum_purchase_amount')::int, minimum_purchase_amount),
      expires_after = COALESCE((reward_data->>'expires_after')::int, expires_after)
    WHERE campaign_id = campaign_id;
  END IF;

  -- Return the updated campaign
  SELECT * INTO updated_campaign FROM campaigns WHERE id = campaign_id;
  RETURN updated_campaign;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_campaign TO authenticated;
GRANT EXECUTE ON FUNCTION update_campaign TO authenticated; 
