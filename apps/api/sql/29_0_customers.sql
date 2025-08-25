CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    mobile TEXT UNIQUE,
    display_name TEXT,
    first_name TEXT,
    last_name TEXT,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE,
    custom JSONB, -- Store extra attributes per business
    tags TEXT[], -- Array of tags instead of separate table
    environment_id UUID REFERENCES environments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- for customer merging function  (multi channel customer id)
ALTER TABLE customers 
ADD COLUMN primary_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL;

CREATE TABLE customer_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    points_balance INT DEFAULT 0,
    current_tier TEXT,
    total_referrals INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE customer_progress
    ALTER COLUMN current_tier TYPE INTEGER USING current_tier::INTEGER,
    ALTER COLUMN current_tier SET DEFAULT 1;


CREATE TABLE customer_action_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    campaign_action_id UUID REFERENCES campaign_actions(id) ON DELETE CASCADE,
    progress_count INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX idx_customer_action_progress_customer ON customer_action_progress(customer_id);
CREATE INDEX idx_customer_action_progress_campaign ON customer_action_progress(campaign_id);

-- Enable RLS
ALTER TABLE customer_action_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS select_customers ON customers;
DROP POLICY IF EXISTS insert_customers ON customers;
DROP POLICY IF EXISTS update_customers ON customers;
DROP POLICY IF EXISTS delete_customers ON customers;

-- Create new policy for selecting customers
CREATE POLICY select_customers ON customers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = customers.business_id
            AND business_users.user_id = auth.uid()
        )
    );

-- Create policy for inserting customers
CREATE POLICY insert_customers ON customers
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = customers.business_id
            AND business_users.user_id = auth.uid()
        )
    );

-- Create policy for updating customers
CREATE POLICY update_customers ON customers
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = customers.business_id
            AND business_users.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = customers.business_id
            AND business_users.user_id = auth.uid()
        )
    );

-- Create policy for deleting customers
CREATE POLICY delete_customers ON customers
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = customers.business_id
            AND business_users.user_id = auth.uid()
        )
    );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON customers TO authenticated;

-- Enable RLS on customer_progress table
ALTER TABLE customer_progress ENABLE ROW LEVEL SECURITY;

-- Create policy for customer_progress based on customer's business
CREATE POLICY manage_customer_progress ON customer_progress
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = customer_progress.customer_id
            AND is_user_in_business(customers.business_id)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = customer_progress.customer_id
            AND is_user_in_business(customers.business_id)
        )
    );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON customer_progress TO authenticated;

-- ✅ Get Customer Tier
CREATE OR REPLACE FUNCTION get_customer_tier(customer_uuid UUID) 
RETURNS INTEGER 
LANGUAGE plpgsql 
AS $$
DECLARE 
    customer_tier INTEGER;
BEGIN
    -- Fetch the customer's tier from customer_progress
    SELECT current_tier INTO customer_tier 
    FROM customer_progress 
    WHERE customer_id = customer_uuid;

    -- Return the integer value of the customer's tier
    RETURN customer_tier;
END;
$$;



-- ✅ Customers can see only the rewards for their own tier
CREATE POLICY customer_view_own_tier_rewards ON tiers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM customer_progress 
            WHERE customer_progress.customer_id = auth.uid()
            AND customer_progress.tier_id = tiers.id
        )
    );

-- Keep only these two comprehensive policies that cover all cases:

-- 1. Policy for customers to manage their own progress
CREATE POLICY customer_view_own_action_progress ON customer_action_progress
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = customer_action_progress.customer_id
            AND customers.id = auth.uid()
        )
    );

CREATE POLICY customer_insert_own_action_progress ON customer_action_progress
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = customer_action_progress.customer_id
            AND customers.id = auth.uid()
        )
    );

CREATE POLICY customer_update_own_action_progress ON customer_action_progress
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = customer_action_progress.customer_id
            AND customers.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = customer_action_progress.customer_id
            AND customers.id = auth.uid()
        )
    );

-- 2. Policy for business team members to manage all progress
CREATE POLICY team_manage_action_progress ON customer_action_progress
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM business_users
            JOIN campaigns ON campaigns.business_id = business_users.business_id
            WHERE business_users.user_id = auth.uid()
            AND campaigns.id = customer_action_progress.campaign_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_users
            JOIN campaigns ON campaigns.business_id = business_users.business_id
            WHERE business_users.user_id = auth.uid()
            AND campaigns.id = customer_action_progress.campaign_id
        )
    );