CREATE OR REPLACE FUNCTION create_campaign(
  campaign_data jsonb,
  actions_data jsonb,
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
    expires_after,
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
    COALESCE((campaign_data->>'start_date')::timestamp, NULL),
    COALESCE((campaign_data->>'end_date')::timestamp, NULL),
    (campaign_data->>'expires_after')::int,
    (campaign_data->>'is_live_on_marketplace')::boolean
  RETURNING * INTO new_campaign;

  -- Insert actions
  IF actions_data IS NOT NULL AND actions_data != '[]'::jsonb THEN
    INSERT INTO "campaign_actions" (
      campaign_id,
      action_type,
      action_details,
      required_count,
      order_index,
      is_mandatory,
      social_link,
      platform,
      icon_url,
      redirection_button_text,
      redirection_button_link
    )
    SELECT
      new_campaign.id,
      action->>'action_type',
      action->>'action_details',
      COALESCE((action->>'required_count')::int, 1),
      COALESCE((action->>'order_index')::int, 0),
      COALESCE((action->>'is_mandatory')::boolean, true),
      action->>'social_link',
      action->>'platform',
      action->>'icon_url',
      action->>'redirection_button_text',
      action->>'redirection_button_link'
    FROM jsonb_array_elements(actions_data) as action;
  END IF;

  -- Insert reward with proper type checking and defaults
  INSERT INTO "campaign_rewards" (
    campaign_id,
    reward_type,
    reward_value,
    reward_unit,
    coupon_code,
    uses_per_customer,
    minimum_purchase_amount,
    expires_after
  )
  SELECT
    new_campaign.id,
    -- Validate reward_type against allowed values
    CASE 
      WHEN reward_data->>'reward_type' IN (
        'rank_points', 'wallet_points', 'wallet_multiplier', 
        'coupon', 'percentage_discount', 'fixed_amount_discount'
      ) THEN reward_data->>'reward_type'
      ELSE 'wallet_points' -- Default value if invalid type provided
    END,
    COALESCE((reward_data->>'reward_value')::int, 0), -- Default to 0 if null
    -- Validate reward_unit against allowed values
    CASE 
      WHEN reward_data->>'reward_unit' IN ('points', '%', 'currency') 
      THEN reward_data->>'reward_unit'
      ELSE 'points'
    END,
    reward_data->>'coupon_code',
    COALESCE((reward_data->>'uses_per_customer')::int, 1),
    COALESCE((reward_data->>'minimum_purchase_amount')::numeric, 0),
    (reward_data->>'expires_after')::int;

  RETURN new_campaign;
END;
$$;

-- Update Campaign Function
CREATE OR REPLACE FUNCTION update_campaign(
  p_campaign_id UUID,
  campaign_data JSONB,
  actions_data JSONB[],
  rewards_data JSONB
) RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_campaign_id UUID := p_campaign_id; -- Declare a local variable
BEGIN
  -- Update campaign
  UPDATE campaigns
  SET
    name = campaign_data->>'name',
    description = campaign_data->>'description',
    type = CASE 
      WHEN campaign_data->>'type' IN ('SignUp', 'Reward Campaign', 'Other') 
      THEN campaign_data->>'type'
      ELSE 'Other'
    END,
    is_repeatable = (campaign_data->>'is_repeatable')::boolean,
    max_achievement = COALESCE((campaign_data->>'max_achievement')::int, 1),
    min_tier = COALESCE((campaign_data->>'min_tier')::int, 1),
    visibility = CASE 
      WHEN campaign_data->>'visibility' IN ('AlwaysVisible', 'NotVisible') 
      THEN campaign_data->>'visibility'
      ELSE 'AlwaysVisible'
    END,
    status = CASE 
      WHEN campaign_data->>'status' IN ('draft', 'active', 'inactive') 
      THEN campaign_data->>'status'
      ELSE 'draft'
    END,
    start_date = (campaign_data->>'start_date')::timestamp,
    end_date = (campaign_data->>'end_date')::timestamp,
    expires_after = (campaign_data->>'expires_after')::int,
    is_live_on_marketplace = COALESCE((campaign_data->>'is_live_on_marketplace')::boolean, false),
    updated_at = now()
  WHERE id = v_campaign_id;

  -- Handle actions if provided
  IF actions_data IS NOT NULL AND array_length(actions_data, 1) > 0 THEN
    -- Delete existing actions
    DELETE FROM campaign_actions WHERE campaign_id = v_campaign_id;

    -- Insert new actions
    INSERT INTO campaign_actions (
      campaign_id,
      action_type,
      action_details,
      required_count,
      order_index,
      is_mandatory,
      social_link,
      platform,
      icon_url,
      redirection_button_text,
      redirection_button_link
    )
    SELECT
      v_campaign_id,
      action_data->>'action_type',
      action_data->>'action_details',
      COALESCE((action_data->>'required_count')::int, 1),
      COALESCE((action_data->>'order_index')::int, 0),
      COALESCE((action_data->>'is_mandatory')::boolean, true),
      action_data->>'social_link',
      action_data->>'platform',
      action_data->>'icon_url',
      action_data->>'redirection_button_text',
      action_data->>'redirection_button_link'
    FROM unnest(actions_data) as action_data;
  END IF;

  -- Handle rewards if provided and not empty
  IF rewards_data IS NOT NULL AND rewards_data != '{}'::jsonb THEN
    -- Delete existing reward
    DELETE FROM campaign_rewards WHERE campaign_id = v_campaign_id;

    -- Insert new reward
    INSERT INTO campaign_rewards (
      campaign_id,
      reward_type,
      reward_value,
      reward_unit,
      coupon_code,
      uses_per_customer,
      minimum_purchase_amount,
      expires_after
    )
    VALUES (
      v_campaign_id,
      CASE 
        WHEN rewards_data->>'reward_type' IN (
          'rank_points', 'wallet_points', 'wallet_multiplier', 
          'coupon', 'percentage_discount', 'fixed_amount_discount'
        ) THEN rewards_data->>'reward_type'
        ELSE 'wallet_points'
      END,
      COALESCE((rewards_data->>'reward_value')::int, 0),
      CASE 
        WHEN rewards_data->>'reward_unit' IN ('points', '%', 'currency') 
        THEN rewards_data->>'reward_unit'
        ELSE 'points'
      END,
      rewards_data->>'coupon_code',
      COALESCE((rewards_data->>'uses_per_customer')::int, 1),
      COALESCE((rewards_data->>'minimum_purchase_amount')::numeric, 0),
      (rewards_data->>'expires_after')::int
    );
  END IF;

  RETURN QUERY SELECT true, 'Campaign updated successfully';
EXCEPTION
  WHEN others THEN
    RETURN QUERY SELECT false, 'Error updating campaign: ' || SQLERRM;
END;
$$;


-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_campaign TO authenticated;
GRANT EXECUTE ON FUNCTION update_campaign TO authenticated; 
