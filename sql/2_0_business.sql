CREATE TABLE business(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  avatar_url varchar(255),
  slug text unique default null,
  contact_name varchar(255),
  business_name varchar(255) NOT NULL,
  business_email varchar(255),
  business_phone varchar(255),
  business_url text,
  business_image text,
  business_meta jsonb,
  business_currency text,
  business_description text,
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
CREATE TABLE business_users(
  id serial PRIMARY KEY,
  business_id uuid REFERENCES business(id),
  user_id uuid REFERENCES public.users(id),
  role VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.business ENABLE ROW LEVEL SECURITY;

-- business account read only to the business_users associated with the business account
CREATE POLICY "Allow business logged-in read access" ON public.business
  FOR SELECT
    USING (auth.role() = 'authenticated');

ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    business_account_role varchar; -- Changed from public.app_role to varchar
    business_account_id uuid;
    business_name varchar;
  begin
    -- Check if the user is marked as admin in the profiles table
    RAISE LOG 'Function started. user id: %', event->>'user_id';

    select business_users.role, business_users.business_id, business.business_name into business_account_role, business_account_id, business_name   from public.business join public.business_users on
    business.id = business_users.business_id where business_users.user_id = (event->>'user_id')::uuid;


    RAISE LOG 'Business account role: %', business_account_role;

    claims := event->'claims';

    if business_account_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{business_account_role}', to_jsonb(business_account_role));
      claims := jsonb_set(claims, '{business_id}', to_jsonb(business_account_id));
      claims := jsonb_set(claims, '{business_name}', to_jsonb(business_name));

        -- Update the 'claims' object in the original event
        event := jsonb_set(event, '{claims}', claims);
    end if;

    RAISE LOG 'Function ended. Event: %', event;
    -- Return the modified or original event
    return event;
  end;
$$;


// ... existing code ...

DROP POLICY IF EXISTS "Allow business individual update access" ON public.business;

CREATE INDEX idx_business_users_lookup ON business_users (user_id, business_id, role, is_active);

CREATE POLICY "Allow business owner update access" ON public.business
  FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM business_users
        WHERE user_id = auth.uid()
        AND business_id = public.business.id
        AND role = 'owner'
        AND is_active = true
      )
    );

// ... existing code ...

grant usage on schema public to supabase_auth_admin;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon;

grant all
  on table public.business
to supabase_auth_admin;

grant all
  on table public.business_users
to supabase_auth_admin;

-- revoke all
--   on table public.business
--   from authenticated, anon;

-- revoke all
--   on table public.business_users
--   from authenticated, anon;

create policy "Allow auth admin to read user roles" ON public.business_users
as permissive for select
to supabase_auth_admin
using (true);


create policy "Allow  business_users logged-in read access" on public.business_users for
select
  using (auth.jwt () ->> 'business_id' = business_id::text);


-- write a function that returns auth.jwt()
CREATE OR REPLACE FUNCTION public.get_jwt()
  RETURNS jsonb
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN auth.jwt();
  END;
  $$;


GRANT EXECUTE ON FUNCTION public.get_jwt() TO authenticated;

CREATE OR REPLACE FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying) RETURNS "uuid"
      LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
    new_business_id uuid;
begin
    insert into business (business_name, slug) values (business_name, slug) returning id into new_business_id;
    insert into business_users (user_id, business_id, role) values (auth.uid(), new_business_id, 'owner');

    return new_business_id;
end;
$$;

ALTER FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying) OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "slug" character varying) TO "service_role";

-- First drop the existing policy
DROP POLICY IF EXISTS "Users can view their own business_users" ON public.business_users;

-- Then create the new policy
CREATE POLICY "Users can view their own business_users"
ON public.business_users
FOR SELECT
USING (auth.uid() = user_id);