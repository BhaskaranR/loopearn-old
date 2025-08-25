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
	billing jsonb NOT NULL,
	"isAIEnabled" bool DEFAULT false NOT NULL,
	whitelabel jsonb DEFAULT '{}'::jsonb NOT NULL,
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
	CONSTRAINT "Business_pkey" PRIMARY KEY (id)
);

-- Add columns from business_loopearn_profile to business
-- Drop columns from business table
CREATE INDEX business_location_index ON business USING GIST(location);

CREATE TABLE public."Project" (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"business_id" uuid NOT NULL,
	"brand_color" text NULL,
	"highlight_border_color" text NULL,
	styling jsonb DEFAULT '{"allowStyleOverwrite": true}'::jsonb NOT NULL,
	config jsonb DEFAULT '{}'::jsonb NOT NULL,
	"recontact_days" int4 DEFAULT 7 NOT NULL,
	"link_branding" bool DEFAULT true NOT NULL,
	"in_app_branding" bool DEFAULT true NOT NULL,
	placement text DEFAULT 'bottomRight'::text NOT NULL,
	"click_outside_close" bool DEFAULT true NOT NULL,
	"dark_overlay" bool DEFAULT false NOT NULL,
	CONSTRAINT "Project_business_id_name_key" UNIQUE ("business_id", name),
	CONSTRAINT "Project_pkey" PRIMARY KEY (id),
	CONSTRAINT "Project_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES public."Business"(id) ON DELETE CASCADE
);
CREATE INDEX "Project_business_id_idx" ON public."Project" USING btree ("business_id");

CREATE TABLE public."Language" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	code text NOT NULL,
	alias text NULL,
	"projectId" text NOT NULL,
	CONSTRAINT "Language_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "Language_projectId_code_key" ON public."Language" USING btree ("projectId", code);

CREATE TABLE public."Environment" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"type" public."EnvironmentType" NOT NULL,
	"project_id" uuid NOT NULL,
	"widget_setup_completed" bool DEFAULT false NOT NULL,
	"app_setup_completed" bool DEFAULT false NOT NULL,
	CONSTRAINT "Environment_pkey" PRIMARY KEY (id)
);
CREATE INDEX "Environment_project_id_idx" ON public."Environment" USING btree ("project_id");

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

