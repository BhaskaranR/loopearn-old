CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES business(id) ON DELETE CASCADE, -- Business that owns the campaign
    name TEXT NOT NULL, -- Campaign name
    description TEXT, -- Description of the campaign
    type TEXT CHECK (type IN ('SignUp', 'Reward Campaign', 'Other')) NOT NULL, -- Campaign type
    is_repeatable BOOLEAN DEFAULT FALSE, -- Can the campaign be repeated?
    max_achievement INT DEFAULT 1, -- Max times a customer can achieve the campaign (-1 for unlimited)
    visibility TEXT CHECK (visibility IN ('AlwaysVisible', 'NotVisible')) DEFAULT 'AlwaysVisible', -- Visibility setting
    icon_url TEXT, -- Icon URL
    redirection_button_text TEXT, -- Call-to-action text
    redirection_button_link TEXT, -- Call-to-action link
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE campaign_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE, -- Links to campaign
    reward_type TEXT CHECK (reward_type IN ('rank_points', 'wallet_points', 'wallet_multiplier', 'coupon')) NOT NULL, -- Reward type
    reward_value INT DEFAULT 0, -- Reward amount (points, multiplier, etc.)
    coupon_code TEXT, -- If the reward is a coupon, store code here
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE campaign_eligibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE, -- Links to campaign
    min_tier INT DEFAULT 1, -- Minimum customer tier required
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE campaign_activation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE, -- Links to campaign
    start_date TIMESTAMP NOT NULL, -- Campaign start time
    end_date TIMESTAMP NOT NULL, -- Campaign end time
    created_at TIMESTAMP DEFAULT now()
);

-- ✅ Get Active Campaigns
-- SELECT c.*
-- FROM campaigns c
-- JOIN campaign_activation ca ON c.id = ca.campaign_id
-- WHERE ca.start_date <= now() AND ca.end_date >= now()
-- AND c.visibility = 'AlwaysVisible';


-- ✅ Get Campaigns for a Customer's Tier
-- SELECT c.*
-- FROM campaigns c
-- JOIN campaign_eligibility ce ON c.id = ce.campaign_id
-- WHERE ce.min_tier <= (SELECT tier FROM customers WHERE id = 'customer-uuid');

-- ✅ Get Rewards for a Campaign
-- SELECT * FROM campaign_rewards WHERE campaign_id = 'campaign-uuid';


-- 6. RLS for Campaigns

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_activation ENABLE ROW LEVEL SECURITY;


-- ✅ Business Can Manage Their Own Campaigns
CREATE POLICY business_manage_campaigns ON campaigns
    FOR ALL
    USING (is_user_in_business(business_id))
    WITH CHECK (is_user_in_business(business_id));

-- ✅ Customers Can View Only Active & Eligible Campaigns
CREATE POLICY customer_view_active_campaigns ON campaigns
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM campaign_activation 
            WHERE campaign_id = campaigns.id
            AND start_date <= now()
            AND end_date >= now()
        )
        AND EXISTS (
            SELECT 1 FROM campaign_eligibility 
            WHERE campaign_id = campaigns.id
            AND min_tier <= (get_customer_tier(auth.uid()))::INT
        )
    );

