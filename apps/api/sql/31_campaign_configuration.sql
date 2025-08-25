CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id UUID REFERENCES environment(id) ON DELETE CASCADE, -- Business that owns the campaign
    name TEXT NOT NULL, -- Campaign name
    description TEXT, -- Description of the campaign
    type TEXT CHECK (type IN ('SignUp', 'Reward Campaign', 'Survey', 'Other')) NOT NULL, -- Campaign type
    is_repeatable BOOLEAN DEFAULT FALSE, -- Can the campaign be repeated?
    max_achievement INT DEFAULT 1, -- Max times a customer can achieve the campaign (-1 for unlimited)
    min_tier INT DEFAULT 1, -- Minimum customer tier required
    visibility TEXT CHECK (visibility IN ('AlwaysVisible', 'NotVisible')) DEFAULT 'AlwaysVisible', -- Visibility setting
    status TEXT CHECK (status IN ('draft', 'active', 'inactive')) DEFAULT 'draft', -- Campaign status
    start_date TIMESTAMP, -- Campaign start time
    end_date TIMESTAMP, -- Campaign end time
    expires_after INT, -- Campaign expiration time in days
    is_live_on_marketplace BOOLEAN DEFAULT FALSE, -- Is the campaign live on the marketplace?
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ✅ Campaign Actions
CREATE TABLE campaign_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- Type of action required (e.g., 'share', 'like', 'comment')
    action_details TEXT, -- Additional details for non-social-media actions (e.g., game rules, time-based instructions, popup messages)
                        -- Not needed for social media actions as those use social_link and platform fields
    required_count INT DEFAULT 1, -- Number of times this action needs to be performed
    order_index INT DEFAULT 0, -- Order in which actions should be completed (0 means any order)
    is_mandatory BOOLEAN DEFAULT true, -- Whether this action is mandatory
    social_link TEXT, -- Social media URL where the action needs to be performed (e.g., https://twitter.com/...)
    platform TEXT, -- Social media platform (e.g., Twitter, Instagram)
    icon_url TEXT, -- Icon URL
    redirection_button_text TEXT, -- Call-to-action text
    redirection_button_link TEXT, -- Call-to-action link
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ✅ Campaign Rewards
CREATE TABLE campaign_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    reward_type TEXT CHECK (reward_type IN ('rank_points', 'wallet_points', 'wallet_multiplier', 'coupon', 'percentage_discount', 'fixed_amount_discount')) NOT NULL,
    reward_value INT DEFAULT 0, -- Reward amount (points, multiplier, etc.)
    reward_unit TEXT CHECK (reward_unit IN ('points', '%', 'currency')) DEFAULT 'points',
    coupon_code TEXT, -- If the reward is a coupon, store code here
    uses_per_customer INT DEFAULT 1, -- How many times a customer can use the reward
    minimum_purchase_amount NUMERIC DEFAULT 0, -- Minimum purchase amount required to use the reward
    expires_after INT, -- Reward expiration in days
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Add indexes for faster lookups
CREATE INDEX idx_campaign_actions_campaign_id ON campaign_actions(campaign_id);
CREATE INDEX idx_campaign_rewards_campaign_id ON campaign_rewards(campaign_id);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_rewards ENABLE ROW LEVEL SECURITY;


-- ✅ Business Can Manage Their Own Campaigns
CREATE POLICY business_manage_campaigns ON campaigns
    FOR ALL
    USING (is_user_in_business(business_id))
    WITH CHECK (is_user_in_business(business_id));

-- ✅ Business Can Manage Their Campaign Actions
CREATE POLICY business_manage_campaign_actions ON campaign_actions
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_actions.campaign_id 
        AND is_user_in_business(campaigns.business_id)
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_actions.campaign_id 
        AND is_user_in_business(campaigns.business_id)
    ));

-- ✅ Business Can Manage Their Campaign Rewards
CREATE POLICY business_manage_campaign_rewards ON campaign_rewards
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_rewards.campaign_id 
        AND is_user_in_business(campaigns.business_id)
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_rewards.campaign_id 
        AND is_user_in_business(campaigns.business_id)
    ));

-- ✅ Customers Can View Only Active & Eligible Campaigns
CREATE POLICY customer_view_active_campaigns ON campaigns
    FOR SELECT
    USING (
        start_date <= now()
        AND (end_date IS NULL OR end_date >= now())
        AND min_tier <= (get_customer_tier(auth.uid()))::INT
    );

-- ✅ Customers Can View Only Active & Eligible Campaign Actions
CREATE POLICY customer_view_active_campaign_actions ON campaign_actions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_actions.campaign_id 
            AND (campaigns.end_date IS NULL OR campaigns.end_date >= now())
            AND (campaigns.start_date <= now() OR campaigns.start_date IS NULL)
            AND (campaigns.min_tier <= (get_customer_tier(auth.uid()))::INT OR campaigns.min_tier IS NULL)
        )
    );

-- ✅ Customers Can View Only Active & Eligible Campaign Rewards
CREATE POLICY customer_view_active_campaign_rewards ON campaign_rewards
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_rewards.campaign_id 
            AND (campaigns.end_date IS NULL OR campaigns.end_date >= now())
            AND (campaigns.start_date <= now() OR campaigns.start_date IS NULL)
            AND (campaigns.min_tier <= (get_customer_tier(auth.uid()))::INT OR campaigns.min_tier IS NULL)
        )
    );


-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_actions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_rewards TO authenticated;
