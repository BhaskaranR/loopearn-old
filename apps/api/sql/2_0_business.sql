CREATE TABLE business(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  avatar_url varchar(255),
  slug text unique default null,
  contact_name varchar(255),
  business_name varchar(255) NOT NULL,
  business_email varchar(255),
  business_phone varchar(255),
  business_url text,
  business_logo text,
  business_meta jsonb,
  business_currency text,
  team__description text,
  website_url text,
  category text,
  tags text[],
  latitude float NOT NULL,
  longitude float NOT NULL,
  location GEOGRAPHY(point),
  address_line_1 varchar(255),
  address_line_2 varchar(255),
  city varchar(255),
  state varchar(255),
  postal_code varchar(255),
  country varchar(255),
  stripe_id text,
  stripe_connect_id text,

  profile_photos TEXT[],
  profile_videos TEXT[],
  profile_bio TEXT,
  profile_website_url TEXT,
  description JSONB,
  terms_conditions JSONB,
  directions JSONB,
  redemption_rules JSONB,
  amenities JSONB,
  marketplace_onboarding_step text DEFAULT null,
  marketplace_listing_status listing_status DEFAULT 'draft',

  plan text default 'free_plus',
  payouts_enabled boolean default false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  referral_code text UNIQUE,
  document_classification boolean default false,
  billing_cycle_start int,
  payment_failed_at timestamp with time zone,
  payout_method_id text,
  shopify_store_id text,
  invoice_prefix text,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;
);


-- Add columns from business_loopearn_profile to business
-- Drop columns from business table
CREATE INDEX business_location_index ON business USING GIST(location);

-- add status
CREATE TABLE business_users(
  id serial PRIMARY KEY,
  business_id uuid REFERENCES business(id),
  user_id uuid REFERENCES public.users(id),
  role VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.business ENABLE ROW LEVEL SECURITY;

-- team account read only to the business_users associated with the teams account
CREATE POLICY "Allow business logged-in read access" ON public.business
  FOR SELECT
    USING (auth.role() = 'authenticated');

ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;

-- ... existing code ...
DROP POLICY IF EXISTS "Allow business individual update access" ON public.business;

CREATE INDEX idx_business_users_lookup ON business_users (user_id, business_id, role, is_active);


grant usage on schema public to supabase_auth_admin;

grant all
  on table public.business
to supabase_auth_admin;

grant all
  on table public.business_users
to supabase_auth_admin;

-- Grant execute permission on the function to the necessary roles
GRANT EXECUTE ON FUNCTION public.get_user_business_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_business_id() TO service_role;

-- business account read only to the business_users associated with the business account
CREATE POLICY "Allow business logged-in read access" ON public.business
  FOR SELECT
  USING (auth.role() = 'authenticated');

ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;

grant usage on schema public to supabase_auth_admin;
grant all on table public.business to supabase_auth_admin;
grant all on table public.business_users to service_role;
grant all on table public.business_users to supabase_auth_admin;

CREATE INDEX idx_business_users_lookup ON business_users (user_id, business_id, role, is_active);

CREATE INDEX idx_business_users_business_id ON business_users (business_id, user_id);

-- ... existing code ...
DROP POLICY IF EXISTS "Allow business owner update access" ON public.business;
CREATE POLICY "Allow business owner update access" ON public.business
  FOR UPDATE
  USING (
    public.is_user_in_business(id) AND 
    public.get_user_role_in_business(id) = 'owner'
  );

DROP POLICY IF EXISTS "Allow business owner delete access" ON public.business;
CREATE POLICY "Allow business owner delete access" ON public.business
  FOR DELETE
  TO authenticated
  USING (
    public.get_user_role_in_business(id) = 'owner'
  );

DROP POLICY IF EXISTS "Allow business_users logged-in read access" ON public.business_users;
CREATE POLICY "Allow business_users logged-in read access" ON public.business_users
  FOR SELECT
  TO authenticated
  USING (
    public.is_user_in_business(business_id)
  );

DROP POLICY IF EXISTS "Allow business_users owner delete access" ON public.business_users;
CREATE POLICY "Allow business_users owner delete access" ON public.business_users
  FOR DELETE
  TO authenticated
  USING (
    public.get_user_role_in_business(business_id) = 'owner'
  );

GRANT EXECUTE ON FUNCTION public.get_jwt() TO authenticated;

CREATE OR REPLACE FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying, "business_email" character varying) RETURNS "uuid"
      LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
    new_business_id uuid;
begin
    insert into business (business_name, slug, business_email) values (business_name, slug, business_email) returning id into new_business_id;
    insert into business_users (user_id, business_id, role) values (auth.uid(), new_business_id, 'owner');

      return new_business_id;
end;
$$;

ALTER FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying, "business_email" character varying) OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying, "business_email" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying, "business_email" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying, "business_email" character varying) TO "service_role";

-- First drop the existing policy
DROP POLICY IF EXISTS "Users can view their own business_users" ON public.business_users;

-- Then create the new policy
CREATE POLICY "Users can view their own business_users"
ON public.business_users
FOR SELECT
USING (auth.uid() = user_id);

-- Drop and recreate the enum type with new platforms
DROP TYPE IF EXISTS social_platform_type CASCADE;

CREATE TYPE social_platform_type AS ENUM (
    'instagram',
    'facebook',
    'twitter',
    'tiktok',
    'threads',
    'linkedin',
    'youtube',
    'mastodon'
);

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

-- Business Address table for handling multiple addresses
create table business_address (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references business(id) on delete cascade,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  directions text,
  latitude float NOT NULL,
  longitude float NOT NULL,
  location GEOGRAPHY(point),
  created_at timestamp with time zone default current_timestamp,
  updated_at timestamp with time zone default current_timestamp
);

CREATE INDEX business_address_location_index ON business_address USING GIST(location);

-- Enable RLS on the business_address table
ALTER TABLE business_address ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to view addresses" ON business_address;
DROP POLICY IF EXISTS "Allow only admins to insert addresses" ON business_address;
DROP POLICY IF EXISTS "Allow only admins to update addresses" ON business_address;
DROP POLICY IF EXISTS "Allow only admins to delete addresses" ON business_address;

-- Policy to allow everyone to view addresses
CREATE POLICY "Allow all users to view addresses" ON business_address
  FOR SELECT
  USING (true);

-- Policy to restrict insert operations to admins
-- Policy to restrict insert operations to admins
CREATE POLICY "Allow only admins to insert addresses" ON business_address
  FOR INSERT
  WITH CHECK (
    public.is_user_in_business(business_id) AND 
    public.get_user_role_in_business(business_id) = 'owner'
  );

-- Policy to restrict update operations to admins
CREATE POLICY "Allow only admins to update addresses" ON business_address
  FOR UPDATE
  USING (
    public.is_user_in_business(business_id) AND 
    public.get_user_role_in_business(business_id) = 'owner'
  );

-- Policy to restrict delete operations to admins
CREATE POLICY "Allow only admins to delete addresses" ON business_address
  FOR DELETE
  USING (
    public.is_user_in_business(business_id) AND 
    public.get_user_role_in_business(business_id) = 'owner'
  );

-- Ensure the policies are applied
ALTER TABLE business_address FORCE ROW LEVEL SECURITY;

CREATE TYPE listing_status AS enum(
  'draft',
  'created',
  'reviewing',
  'document_required',
  'approved',
  'rejected'
);

-- Business Marketplace Place table for handling marketplace places
CREATE TABLE business_marketplace (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business(id) ON DELETE CASCADE,
 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

alter table business_marketplace add column status listing_status DEFAULT 'draft';

-- Enable RLS on the business_marketplace table
ALTER TABLE business_marketplace ENABLE ROW LEVEL SECURITY;



-- Enable RLS on the business_marketplace table
ALTER TABLE business_marketplace ENABLE ROW LEVEL SECURITY;

-- Create new policies for business_marketplace
CREATE POLICY "Allow all users to view marketplace places" ON business_marketplace
  FOR SELECT
  USING (true);

CREATE POLICY "Allow only admins to insert marketplace places" ON business_marketplace
  FOR INSERT
  WITH CHECK (
    public.is_user_in_business(business_id) AND 
    public.get_user_role_in_business(business_id) = 'owner'
  );

CREATE POLICY "Allow only admins to update marketplace places" ON business_marketplace
  FOR UPDATE
  USING (
    public.is_user_in_business(business_id) AND 
    public.get_user_role_in_business(business_id) = 'owner'
  );

CREATE POLICY "Allow only admins to delete marketplace places" ON business_marketplace
  FOR DELETE
  USING (
    public.is_user_in_business(business_id) AND 
    public.get_user_role_in_business(business_id) = 'owner'
  );

-- Ensure the policies are applied
ALTER TABLE business_marketplace FORCE ROW LEVEL SECURITY;

