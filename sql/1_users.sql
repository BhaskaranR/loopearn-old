-- Custom types
CREATE TYPE public.user_status AS enum(
  'ONLINE',
  'OFFLINE'
);

-- USERS
CREATE TABLE public.users(
  -- UUID from auth.users
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  username text,
  full_name text,
  avatar_url text,
  address jsonb,
  phone text,
  metadata jsonb,
  status user_status DEFAULT 'OFFLINE' ::public.user_status,
  referral_code text UNIQUE,
  business_id uuid references public.business(id) default null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  locale text DEFAULT 'en'
);

ALTER TABLE public.users ADD COLUMN business_id uuid references public.business(id) default null;

COMMENT ON TABLE public.users IS 'Profile data for each user.';

COMMENT ON COLUMN public.users.id IS 'References the internal Supabase Auth user.';

-- Set up Storage!
INSERT INTO storage.buckets(
  id,
  name)
VALUES (
  'avatars',
  'avatars');

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT
    WITH CHECK (
bucket_id = 'avatars');

CREATE POLICY "Anyone can update an avatar." ON storage.objects
  FOR UPDATE
    WITH CHECK (bucket_id = 'avatars');

-- Secure the tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Allow logged-in read access" ON public.users
  FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow individual insert access" ON public.users
  FOR INSERT
    WITH CHECK (
auth.uid() = id);

CREATE POLICY "Allow individual update access" ON public.users
  FOR UPDATE
    USING (auth.uid() = id);

-- create policy "Allow individual read access" on public.user_roles
--   for select using (auth.role() = 'authenticated');
-- Send "previous data" on change
ALTER TABLE public.users REPLICA IDENTITY
  FULL;

-- add tables to the publication
ALTER publication supabase_realtime
  ADD TABLE public.users;

CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email text)
  RETURNS uuid
  AS $$
DECLARE
  user_id uuid;
BEGIN
  SELECT
    id
  FROM
    auth.users
  WHERE
    email = user_email INTO user_id;
  RETURN user_id;
END;
$$
LANGUAGE plpgsql
SECURITY INVOKER;

GRANT ALL ON auth.users TO service_role;

CREATE TYPE user_referral AS (
  email text
);

CREATE OR REPLACE FUNCTION get_user_referrals(user_id text)
  RETURNS SETOF user_referral
  AS $$
    var json_result = plv8.execute(
    "select email from auth.users where raw_user_meta_data->>'invited_by'= $1",
      [user_id]
    );
    return json_result;
$$
LANGUAGE plv8;
