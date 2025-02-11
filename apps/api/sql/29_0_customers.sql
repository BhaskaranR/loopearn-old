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
    business_id UUID REFERENCES business(id) ON DELETE CASCADE,
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

-- Enable RLS on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

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
RETURNS TEXT 
LANGUAGE plpgsql 
AS $$
DECLARE 
    customer_tier TEXT;
BEGIN
    -- Fetch the customer's tier from customer_progress
    SELECT current_tier INTO customer_tier 
    FROM customer_progress 
    WHERE customer_id = customer_uuid;

    -- If no tier is found, default to 'Bronze' (or any default tier)
    RETURN COALESCE(customer_tier, 'Bronze');
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