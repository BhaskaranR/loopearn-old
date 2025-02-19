CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES business(id) ON DELETE CASCADE, -- Business that owns the campaign
    name TEXT NOT NULL, -- Campaign name
    description TEXT, -- Description of the campaign
    type TEXT CHECK (type IN ('SignUp', 'Reward Campaign', 'Other')) NOT NULL, -- Campaign type
    is_repeatable BOOLEAN DEFAULT FALSE, -- Can the campaign be repeated?
    max_achievement INT DEFAULT 1, -- Max times a customer can achieve the campaign (-1 for unlimited)
    min_tier INT DEFAULT 1, -- Minimum customer tier required
    visibility TEXT CHECK (visibility IN ('AlwaysVisible', 'NotVisible')) DEFAULT 'AlwaysVisible', -- Visibility setting
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active', -- Campaign status
    start_date TIMESTAMP, -- Campaign start time
    end_date TIMESTAMP , -- Campaign end time
    expires_after INT, -- Campaign expiration time in days
    is_live_on_marketplace BOOLEAN DEFAULT FALSE, -- Is the campaign live on the marketplace?
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
);

ALTER TABLE campaigns ALTER COLUMN end_date DROP NOT NULL;
ALTER TABLE campaigns ADD COLUMN expires_after INT;

-- ✅ Campaign Action Rewards
CREATE TABLE campaign_action_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE, -- Links to campaign
    icon_url TEXT, -- Icon URL
    redirection_button_text TEXT, -- Call-to-action text
    redirection_button_link TEXT, -- Call-to-action link
    reward_type TEXT CHECK (reward_type IN ('rank_points', 'wallet_points', 'wallet_multiplier', 'coupon', 'percentage_discount', 'fixed_amount_discount')) NOT NULL, -- Reward type
    reward_value INT DEFAULT 0, -- Reward amount (points, multiplier, etc.)
    reward_unit TEXT CHECK (reward_unit IN ('points', '%', 'currency')) DEFAULT 'points', -- Unit of the reward
    action_type TEXT NOT NULL, -- Type of action
    action_details TEXT, -- Additional details about the action
    coupon_code TEXT, -- If the reward is a coupon, store code here
    uses_per_customer INT DEFAULT 1, -- How many times a customer can use the reward
    minimum_purchase_amount NUMERIC DEFAULT 0, -- Minimum purchase amount required to use the reward
    created_at TIMESTAMP DEFAULT now(),
);

-- ✅ Get Campaigns for a Customer's Tier
-- SELECT c.*
-- FROM campaigns c
-- JOIN campaign_eligibility ce ON c.id = ce.campaign_id
-- WHERE ce.min_tier <= (SELECT tier FROM customers WHERE id = 'customer-uuid');

-- ✅ Get Rewards for a Campaign
-- SELECT * FROM campaign_action_rewards WHERE campaign_id = 'campaign-uuid';


-- 6. RLS for Campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_action_rewards ENABLE ROW LEVEL SECURITY;

-- ✅ Business Can Manage Their Own Campaigns
CREATE POLICY business_manage_campaigns ON campaigns
    FOR ALL
    USING (is_user_in_business(business_id))
    WITH CHECK (is_user_in_business(business_id));

-- ✅ Customers Can View Only Active & Eligible Campaigns
DROP POLICY IF EXISTS customer_view_active_campaigns ON campaigns;

CREATE POLICY customer_view_active_campaigns ON campaigns
    FOR SELECT
    USING (
        start_date <= now()
        AND end_date >= now()
        AND min_tier <= (get_customer_tier(auth.uid()))::INT
    );

-- ✅ Business Can Manage Their Own Campaign Rewards
CREATE POLICY business_manage_campaign_action_rewards ON campaign_action_rewards
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_action_rewards.campaign_id 
        AND is_user_in_business(campaigns.business_id)
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_action_rewards.campaign_id 
        AND is_user_in_business(campaigns.business_id)
    ));


-- -- ✅ Customers can only view campaign rewards they have earned based on events
-- CREATE POLICY customer_view_earned_rewards ON campaign_action_rewards
--     FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM events 
--             WHERE events.customer_id = auth.uid()
--             AND events.campaign_id = campaign_action_rewards.campaign_id
--         )
--     );



GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_action_rewards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaigns TO authenticated;
