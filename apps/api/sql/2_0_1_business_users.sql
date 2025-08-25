
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
