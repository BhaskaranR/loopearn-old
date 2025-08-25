
-- Recreate the table with updated enum
CREATE TABLE IF NOT EXISTS business_social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES business(id) ON DELETE CASCADE,
    platform social_platform_type NOT NULL,
    platform_user_id TEXT,
    username TEXT,
    display_name TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    profile_image_url TEXT,
    follower_count INT,
    following_count INT,
    is_connected BOOLEAN DEFAULT false,
    metadata JSONB, -- Store platform-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    -- Additional fields for Mastodon
    instance_url TEXT, -- For Mastodon server URL
    -- Ensure one platform per business
    UNIQUE(business_id, platform)
);

-- Enable RLS
ALTER TABLE business_social_accounts ENABLE ROW LEVEL SECURITY;

-- Policies for business_social_accounts
CREATE POLICY "Team members can view social accounts" ON business_social_accounts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = business_social_accounts.business_id
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can manage social accounts" ON business_social_accounts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = business_social_accounts.business_id
            AND business_users.user_id = auth.uid()
            AND business_users.role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_users
            WHERE business_users.business_id = business_social_accounts.business_id
            AND business_users.user_id = auth.uid()
            AND business_users.role IN ('owner', 'admin')
        )
    );

-- Add function to check if social account is connected
CREATE OR REPLACE FUNCTION is_social_account_connected(
    p_business_id UUID,
    p_platform social_platform_type
) RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM business_social_accounts
        WHERE business_id = p_business_id
        AND platform = p_platform
        AND is_connected = true
    );
$$;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON business_social_accounts TO authenticated;
GRANT EXECUTE ON FUNCTION is_social_account_connected TO authenticated;

-- Add function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to update updated_at
CREATE TRIGGER update_business_social_accounts_updated_at
    BEFORE UPDATE ON business_social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE business_social_accounts IS 'Stores social media account connections for businesses';
COMMENT ON COLUMN business_social_accounts.platform_user_id IS 'The unique identifier from the social platform';
COMMENT ON COLUMN business_social_accounts.instance_url IS 'The Mastodon instance URL (e.g., mastodon.social)';
COMMENT ON COLUMN business_social_accounts.metadata IS 'Platform-specific data in JSON format. Examples: Mastodon: {"instance_version": "4.0.2", "scopes": ["read", "write"]}, Bluesky: {"did": "did:plc:123", "handle": "user.bsky.social"}';
