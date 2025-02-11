CREATE TABLE tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES business(id) ON DELETE CASCADE, -- Each business has its own tier system
    tier_name TEXT UNIQUE NOT NULL, -- Name of the tier (e.g., Basic, Bronze, Silver, Gold, Platinum)
    min_spending NUMERIC(10,2) NOT NULL, -- Minimum spending required to achieve this tier
    benefits JSONB, -- JSON object to store tier-specific benefits
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);


ALTER TABLE customer_progress 
ADD COLUMN tier_id UUID REFERENCES tiers(id) ON DELETE SET NULL;


-- UPDATE customer_progress 
-- SET tier_id = (
--     SELECT id FROM tiers 
--     WHERE business_id = 'business-uuid'
--     AND min_spending <= (SELECT SUM(amount) FROM transactions WHERE customer_id = 'customer-uuid')
--     ORDER BY min_spending DESC LIMIT 1
-- )
-- WHERE customer_id = 'customer-uuid';


-- SELECT t.tier_name, t.benefits 
-- FROM tiers t 
-- JOIN customer_progress cp ON t.id = cp.tier_id 
-- WHERE cp.customer_id = 'customer-uuid';


-- CREATE OR REPLACE FUNCTION auto_update_customer_tier()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     UPDATE customer_progress 
--     SET tier_id = (
--         SELECT id FROM tiers 
--         WHERE business_id = NEW.business_id
--         AND min_spending <= (SELECT SUM(amount) FROM transactions WHERE customer_id = NEW.customer_id)
--         ORDER BY min_spending DESC LIMIT 1
--     )
--     WHERE customer_id = NEW.customer_id;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER update_tier_on_spending
-- AFTER INSERT OR UPDATE ON transactions
-- FOR EACH ROW EXECUTE FUNCTION auto_update_customer_tier();


-- 1. Modify tiers Table to Store Benefits
-- sql
-- Copy
-- Edit
-- ALTER TABLE tiers 
-- ADD COLUMN benefits JSONB DEFAULT '{}'::JSONB;
-- ✅ Stores tier-specific benefits dynamically
-- ✅ Allows easy future modifications

-- 2. Define JSONB Structure for benefits
-- Here’s how the JSONB structure will look like:

-- json
-- Copy
-- Edit
-- {
--     "entry_reward": {
--         "reward_type": "points",
--         "value": 500,
--         "description": "Welcome bonus for joining this tier."
--     },
--     "order_reward": {
--         "reward_type": "points_multiplier",
--         "multiplier": 2,
--         "description": "Earn double points on every order."
--     },
--     "lifetime_reward": {
--         "reward_type": "discount",
--         "discount_percentage": 10,
--         "description": "Lifetime 10% discount for tier members."
--     },
--     "custom_benefits": [
--         {
--             "name": "Free Shipping",
--             "description": "Get free shipping on all orders above $50."
--         },
--         {
--             "name": "Priority Support",
--             "description": "Get priority customer support."
--         }
--     ]
-- }
-- 3. Explanation of Each Benefit Type
-- Benefit	Key in JSONB	Fields	Example
-- Entry Reward	entry_reward	reward_type, value, description	{ "reward_type": "points", "value": 500, "description": "Welcome bonus for joining this tier." }
-- Order Reward	order_reward	reward_type, multiplier, description	{ "reward_type": "points_multiplier", "multiplier": 2, "description": "Earn double points on every order." }
-- Lifetime Reward	lifetime_reward	reward_type, discount_percentage, description	{ "reward_type": "discount", "discount_percentage": 10, "description": "Lifetime 10% discount for tier members." }
-- Custom Benefits	custom_benefits	name, description	[{"name": "Free Shipping", "description": "Get free shipping on all orders above $50."}]
-- 4. Query to Insert a Tier with Benefits
-- sql
-- Copy
-- Edit
-- INSERT INTO tiers (business_id, tier_name, min_spending, benefits) 
-- VALUES (
--     'business-uuid', 
--     'Gold', 
--     7500, 
--     '{
--         "entry_reward": {"reward_type": "points", "value": 500, "description": "Welcome bonus for joining this tier."},
--         "order_reward": {"reward_type": "points_multiplier", "multiplier": 2, "description": "Earn double points on every order."},
--         "lifetime_reward": {"reward_type": "discount", "discount_percentage": 10, "description": "Lifetime 10% discount for tier members."},
--         "custom_benefits": [
--             {"name": "Free Shipping", "description": "Get free shipping on all orders above $50."},
--             {"name": "Priority Support", "description": "Get priority customer support."}
--         ]
--     }'::jsonb
-- );
-- 5. Query to Retrieve Benefits for a Specific Tier
-- sql
-- Copy
-- Edit
-- SELECT benefits 
-- FROM tiers 
-- WHERE tier_name = 'Gold';
-- ✅ Returns all benefits for the Gold tier.

-- 6. Query to Extract a Specific Benefit (e.g., Order Reward)
-- sql
-- Copy
-- Edit
-- SELECT benefits->'order_reward' 
-- FROM tiers 
-- WHERE tier_name = 'Gold';
-- ✅ Returns:

-- json
-- Copy
-- Edit
-- {
--     "reward_type": "points_multiplier",
--     "multiplier": 2,
--     "description": "Earn double points on every order."
-- }
-- 7. Query to Check If a Tier Has a Custom Benefit (e.g., Free Shipping)
-- sql
-- Copy
-- Edit
-- SELECT * FROM tiers 
-- WHERE benefits->'custom_benefits' @> '[{"name": "Free Shipping"}]';
-- ✅ Returns tiers that offer Free Shipping.


ALTER TABLE tiers ENABLE ROW LEVEL SECURITY;


CREATE POLICY business_manage_tiers ON tiers
    FOR ALL
    USING (is_user_in_business(business_id))
    WITH CHECK (is_user_in_business(business_id));


GRANT SELECT, INSERT, UPDATE, DELETE ON tiers TO authenticated;


