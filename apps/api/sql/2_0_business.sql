CREATE TABLE teams(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  avatar_url varchar(255),
  slug text unique default null,
  contact_name varchar(255),
  team_name varchar(255) NOT NULL,
  team_email varchar(255),
  team_phone varchar(255),
  team_url text,
  team_image text,
  team_meta jsonb,
  team_currency text,
  team__description text,
  website_url text,
  category text,
  tags text[],
  address_line_1 varchar(255),
  address_line_2 varchar(255),
  city varchar(255),
  state varchar(255),
  postal_code varchar(255),
  country varchar(255),
  stripe_id text,
  stripe_connect_id text,
  plan text default 'free',
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


-- add status
CREATE TABLE users_on_teams(
  id serial PRIMARY KEY,
  team_id uuid REFERENCES teams(id),
  user_id uuid REFERENCES public.users(id),
  role VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- team account read only to the business_users associated with the teams account
CREATE POLICY "Allow team logged-in read access" ON public.teams
  FOR SELECT
    USING (auth.role() = 'authenticated');

ALTER TABLE public.users_on_teams ENABLE ROW LEVEL SECURITY;

-- ... existing code ...
DROP POLICY IF EXISTS "Allow team individual update access" ON public.teams;

CREATE INDEX idx_business_users_lookup ON business_users (user_id, business_id, role, is_active);

CREATE POLICY "Allow team owner update access" ON public.teams
  FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM users_on_teams
        WHERE user_id = auth.uid()
        AND team_id = public.teams.id
        AND role = 'owner'
        AND is_active = true
      )
    );

grant usage on schema public to supabase_auth_admin;


grant all
  on table public.teams
to supabase_auth_admin;

grant all
  on table public.users_on_teams
to supabase_auth_admin;

CREATE OR REPLACE FUNCTION public.get_user_team_id() RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    user_team_id text;
BEGIN
    SELECT team_id INTO user_team_id
    FROM public.users_on_teams
    WHERE user_id = auth.uid()
    LIMIT 1; -- Assuming a user can be associated with only one business at a time

    RAISE NOTICE 'User ID: %, Business ID: %', auth.uid(), user_team_id;
    RETURN user_team_id;
END;
$$;


-- Grant execute permission on the function to the necessary roles
GRANT EXECUTE ON FUNCTION public.get_user_team_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_team_id() TO service_role;



-- Update the policy to use the new function
CREATE POLICY "Allow users_on_teams logged-in read access" ON public.users_on_teams
FOR SELECT
USING (public.get_user_team_id() = team_id::text);

GRANT EXECUTE ON FUNCTION public.get_jwt() TO authenticated;

CREATE OR REPLACE FUNCTION "public"."create_team"("team_name" character varying, "slug" character varying, "team_email" character varying) RETURNS "uuid"
      LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
    new_team_id uuid;
begin
    insert into teams (team_name, slug, team_email) values (team_name, slug, team_email) returning id into new_team_id;
    insert into users_on_teams (user_id, team_id, role) values (auth.uid(), new_team_id, 'owner');

    return new_team_id;
end;
$$;

ALTER FUNCTION "public"."create_team"("team_name" character varying, "slug" character varying, "team_email" character varying) OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."create_team"("team_name" character varying, "slug" character varying, "team_email" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."create_team"("team_name" character varying, "slug" character varying, "team_email" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_team"("team_name" character varying, "slug" character varying, "team_email" character varying) TO "service_role";

-- First drop the existing policy
DROP POLICY IF EXISTS "Users can view their own users_on_teams" ON public.users_on_teams;

-- Then create the new policy
CREATE POLICY "Users can view their own users_on_teams"
ON public.users_on_teams
FOR SELECT
USING (auth.uid() = user_id);