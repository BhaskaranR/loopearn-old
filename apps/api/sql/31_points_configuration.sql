-- Create points configuration table for businesses
CREATE TABLE points_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id UUID REFERENCES environments(id) ON DELETE CASCADE,
    customer_tier TEXT DEFAULT NULL ,
    -- Points earning settings
    points_per_currency DECIMAL(10, 2) DEFAULT 2.0, -- e.g., 2 points for every 1 USD
    currency TEXT DEFAULT 'USD',
    -- Points expiry settings
    points_expiry_days INT DEFAULT 720, -- Default 720 days (2 years)
    points_expiry_enabled BOOLEAN DEFAULT true,
    -- Collection-based settings
    collection_based_earning_enabled BOOLEAN DEFAULT true,
    collection_ids TEXT[], -- Array of collection IDs that are eligible for points
    all_products_eligible BOOLEAN DEFAULT true,
    -- Status
    is_active BOOLEAN DEFAULT true,
    -- Metadata for future extensibility
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    -- Ensure one configuration per business
    UNIQUE(environment_id)
);

ALTER TABLE points_configuration
ADD COLUMN customer_tier TEXT DEFAULT NULL; -- NULL can represent a default tier

-- Enable RLS
ALTER TABLE points_configuration ENABLE ROW LEVEL SECURITY;

-- Add trigger for updated_at
CREATE TRIGGER update_points_configuration_updated_at
    BEFORE UPDATE ON points_configuration
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Policies for points_configuration
CREATE POLICY "Team members can view points configuration" ON points_configuration
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = points_configuration.business_id
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Only owners and admins can manage points configuration" ON points_configuration
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = points_configuration.business_id
            AND business_users.user_id = auth.uid()
            AND business_users.role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = points_configuration.business_id
            AND business_users.user_id = auth.uid()
            AND business_users.role IN ('owner', 'admin')
        )
    );

-- Function to get points configuration for a business
// ... existing code ...
CREATE OR REPLACE FUNCTION get_points_configuration(p_business_id UUID, p_customer_tier TEXT)
RETURNS points_configuration
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT *
    FROM points_configuration
    WHERE business_id = p_business_id
    AND is_active = true -- Ensure the configuration is active
    AND (customer_tier = p_customer_tier OR customer_tier IS NULL) -- NULL for default tier
    ORDER BY customer_tier DESC -- Specific tiers take precedence
    LIMIT 1;
$$;
// ... existing code ...

-- Function to create default points configuration for a new business
CREATE OR REPLACE FUNCTION create_default_points_configuration()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO points_configuration (business_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default points configuration when a new business is created
CREATE TRIGGER create_points_configuration_for_new_business
    AFTER INSERT ON business
    FOR EACH ROW
    EXECUTE FUNCTION create_default_points_configuration();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON points_configuration TO authenticated;
GRANT EXECUTE ON FUNCTION get_points_configuration TO authenticated;

-- Add helpful comments
COMMENT ON TABLE points_configuration IS 'Stores points earning and redemption configuration for each business';
COMMENT ON COLUMN points_configuration.points_per_currency IS 'Number of points earned per unit of currency spent';
COMMENT ON COLUMN points_configuration.points_expiry_days IS 'Number of days after which points expire';
COMMENT ON COLUMN points_configuration.collection_ids IS 'Array of collection IDs that are eligible for points earning';
COMMENT ON COLUMN points_configuration.metadata IS 'Additional configuration options in JSON format'; 