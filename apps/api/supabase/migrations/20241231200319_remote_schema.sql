

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






CREATE SCHEMA IF NOT EXISTS "private";


ALTER SCHEMA "private" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "plv8" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";






CREATE TYPE "public"."kyc_status" AS ENUM (
    'pending',
    'verified',
    'rejected'
);


ALTER TYPE "public"."kyc_status" OWNER TO "postgres";


CREATE TYPE "public"."profile_status" AS ENUM (
    'pending',
    'incomplete',
    'complete'
);


ALTER TYPE "public"."profile_status" OWNER TO "postgres";


CREATE TYPE "public"."teamRoles" AS ENUM (
    'owner',
    'member'
);


ALTER TYPE "public"."teamRoles" OWNER TO "postgres";


CREATE TYPE "public"."user_referral" AS (
	"email" "text"
);


ALTER TYPE "public"."user_referral" OWNER TO "postgres";


CREATE TYPE "public"."user_status" AS ENUM (
    'ONLINE',
    'OFFLINE'
);


ALTER TYPE "public"."user_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."get_invites_for_authenticated_user"() RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select business_id
  from user_invites
  where email = auth.jwt() ->> 'email'
$$;


ALTER FUNCTION "private"."get_invites_for_authenticated_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."get_teams_for_authenticated_user"() RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select business_id
  from business_users
  where user_id = auth.uid()
$$;


ALTER FUNCTION "private"."get_teams_for_authenticated_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_business"("business_name" character varying, "industry" character varying) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
    new_business_id uuid;
begin
    insert into business (business_name, industry, owner_id) values (business_name, industry, auth.uid()) returning id into new_business_id;
    insert into business_users (user_id, business_id, role) values (auth.uid(), new_business_id, 'owner');

    return new_business_id;
end;
$$;


ALTER FUNCTION "public"."create_business"("business_name" character varying, "industry" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE
    AS $$
  declare
    claims jsonb;
    business_account_role varchar; -- Changed from public.app_role to varchar
    business_account_id uuid;
    business_name varchar;
    industry varchar;
  begin
    -- Check if the user is marked as admin in the profiles table
    RAISE LOG 'Function started. user id: %', event->>'user_id';

    select business_users.role, business_users.business_id, business.business_name, business.industry into business_account_role, business_account_id, business_name, industry   from public.business join public.business_users on
    business.id = business_users.business_id where business_users.user_id = (event->>'user_id')::uuid;


    RAISE LOG 'Business account role: %', business_account_role;

    claims := event->'claims';

    if business_account_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{business_account_role}', to_jsonb(business_account_role));
      claims := jsonb_set(claims, '{business_id}', to_jsonb(business_account_id));
      claims := jsonb_set(claims, '{business_name}', to_jsonb(business_name));
      claims := jsonb_set(claims, '{industry}', to_jsonb(industry));

        -- Update the 'claims' object in the original event
        event := jsonb_set(event, '{claims}', claims);
    end if;

    RAISE LOG 'Function ended. Event: %', event;
    -- Return the modified or original event
    return event;
  end;
$$;


ALTER FUNCTION "public"."custom_access_token_hook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_referral_code"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  referral_code TEXT;
  referral_code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character alphanumeric code
    referral_code := SUBSTRING(MD5(RANDOM()::TEXT), 1, 8);

    -- Check if the referral code already exists in the users or business table
    EXECUTE format('
      SELECT EXISTS (
        SELECT 1 FROM public.users u WHERE u.referral_code = %L
      ) OR EXISTS (
        SELECT 1 FROM public.business b WHERE b.referral_code = %L
      )', referral_code, referral_code)
    INTO referral_code_exists;

    -- If the referral code doesn't exist in either table, exit the loop
    EXIT WHEN NOT referral_code_exists;
  END LOOP;

  RETURN referral_code;
END;
$$;


ALTER FUNCTION "public"."generate_referral_code"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_jwt"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
  BEGIN
    RETURN auth.jwt();
  END;
  $$;


ALTER FUNCTION "public"."get_jwt"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("user_email" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
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
$$;


ALTER FUNCTION "public"."get_user_id_by_email"("user_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_referrals"("user_id" "text") RETURNS SETOF "public"."user_referral"
    LANGUAGE "plv8"
    AS $_$
    var json_result = plv8.execute(
    "select email from auth.users where raw_user_meta_data->>'invited_by'= $1",
      [user_id]
    );
    return json_result;
$_$;


ALTER FUNCTION "public"."get_user_referrals"("user_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  business_id uuid;
  new_referral_code TEXT;
  referrer_id uuid;
BEGIN
  RAISE LOG 'Generate new referral code';

  SELECT id, referral_code INTO  business_id, new_referral_code
    FROM
      public.business
    WHERE
      business_name = NEW.raw_user_meta_data ->> 'companyName';

  IF new_referral_code IS NULL THEN
    new_referral_code := public.generate_referral_code();
  end IF;

  RAISE LOG 'Generated referral code: %', new_referral_code;
  IF (NEW.raw_user_meta_data ->> 'is_invite' IS NOT NULL) THEN
    -- call
    INSERT INTO public.users(
      id,
      username,
      business_id,
      full_name,
      phone,
      metadata,
      profile_status,
      avatar_url,
      referral_code)
    VALUES (
      NEW.id,
      NEW.email,
      business_id,
      CONCAT(
      NEW.raw_user_meta_data ->> 'first_name', ' ',
      NEW.raw_user_meta_data ->> 'last_name'),
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data,
      'pending',
      NEW.raw_user_meta_data ->> 'avatar_url',
      new_referral_code
      );

    -- if business account insert into company table & company users table
    IF (NEW.raw_user_meta_data ->> 'companyName' IS NOT NULL) THEN

      -- If not found, insert new business and get the new ID
      IF business_id IS NULL THEN
          RAISE EXCEPTION  'This company does not exist. Please reach out to your company administrator for an invitation and to enable your account.';
      END IF;

      RAISE LOG 'Handle New User role: %', business_id;
      -- Insert into business_users with the found or new business ID
      INSERT INTO public.business_users(
        business_id,
        user_id,
        ROLE)
      VALUES (
        business_id,
        NEW.id,
        COALESCE(
        NEW.raw_user_meta_data ->> 'role', 'admin'));
    END IF;
  ELSE
    INSERT INTO public.users(
      id,
      username,
      full_name,
      phone,
      metadata,
      profile_status,
      avatar_url,
      referral_code)
    VALUES (
      NEW.id,
      NEW.email,
      CONCAT(
	    NEW.raw_user_meta_data ->> 'first_name', ' ',
	    NEW.raw_user_meta_data ->> 'last_name'),
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data,
      'complete',
      NEW.raw_user_meta_data ->> 'avatar_url',
      new_referral_code);

    -- if business account insert into company table & company users table
    IF (NEW.raw_user_meta_data ->> 'companyName' IS NOT NULL) THEN
      -- if found throw an error
      IF business_id IS NOT NULL THEN
        RAISE EXCEPTION 'This company already exists. Please reach out to your company administrator for an invitation and to enable your account.';
      END IF;


      -- If not found, insert new business and get the new ID
      IF business_id IS NULL THEN
        INSERT INTO public.business(
          business_name,
          business_email,
          industry,
          owner_id,
          ein,
          referral_code)
        VALUES (
          NEW.raw_user_meta_data ->> 'companyName',
          NEW.email,
          NEW.raw_user_meta_data ->> 'industry',
          NEW.id,
          NEW.raw_user_meta_data ->> 'ein',
          new_referral_code)
        RETURNING
        id INTO business_id;
      END IF;

      RAISE LOG 'Handle New User role: %', business_id;
      -- Insert into business_users with the found or new business ID
      INSERT INTO public.business_users(
        business_id,
        user_id,
        ROLE)
      VALUES (
        business_id,
        NEW.id,
        COALESCE(
          NEW.raw_user_meta_data ->> 'role', 'admin'));
    END IF;
  END IF;

  RAISE LOG 'Referral Code: %', NEW.raw_user_meta_data ->> 'referral_code';

  if (NEW.raw_user_meta_data ->> 'referral_code' IS NOT NULL) THEN
    referrer_id := public.get_user_id_by_ref_code(NEW.raw_user_meta_data ->> 'referral_code');

    if (referrer_id  IS NOT NULL) THEN
      INSERT INTO public.referrals(
        referrer_id,
        referred_id,
        referral_code)
      VALUES (
        referrer_id,
        NEW.id,
        NEW.raw_user_meta_data ->> 'referral_code');
    END IF;
  END IF;
  RETURN new;
END;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."nanoid"("size" integer DEFAULT 21, "alphabet" "text" DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'::"text", "additionalbytesfactor" double precision DEFAULT 1.6) RETURNS "text"
    LANGUAGE "plpgsql" PARALLEL SAFE
    AS $$
DECLARE
    alphabetArray  text[];
    alphabetLength int := 64;
    mask           int := 63;
    step           int := 34;
BEGIN
    IF size IS NULL OR size < 1 THEN
        RAISE EXCEPTION 'The size must be defined and greater than 0!';
    END IF;

    IF alphabet IS NULL OR length(alphabet) = 0 OR length(alphabet) > 255 THEN
        RAISE EXCEPTION 'The alphabet can''t be undefined, zero or bigger than 255 symbols!';
    END IF;

    IF additionalBytesFactor IS NULL OR additionalBytesFactor < 1 THEN
        RAISE EXCEPTION 'The additional bytes factor can''t be less than 1!';
    END IF;

    alphabetArray := regexp_split_to_array(alphabet, '');
    alphabetLength := array_length(alphabetArray, 1);
    mask := (2 << cast(floor(log(alphabetLength - 1) / log(2)) as int)) - 1;
    step := cast(ceil(additionalBytesFactor * mask * size / alphabetLength) AS int);

    IF step > 1024 THEN
        step := 1024; -- The step size % can''t be bigger then 1024!
    END IF;

    RETURN nanoid_optimized(size, alphabet, mask, step);
END
$$;


ALTER FUNCTION "public"."nanoid"("size" integer, "alphabet" "text", "additionalbytesfactor" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."nanoid_optimized"("size" integer, "alphabet" "text", "mask" integer, "step" integer) RETURNS "text"
    LANGUAGE "plpgsql" PARALLEL SAFE
    AS $$
DECLARE
    idBuilder      text := '';
    counter        int  := 0;
    bytes          bytea;
    alphabetIndex  int;
    alphabetArray  text[];
    alphabetLength int  := 64;
BEGIN
    alphabetArray := regexp_split_to_array(alphabet, '');
    alphabetLength := array_length(alphabetArray, 1);

    LOOP
        bytes := extensions.gen_random_bytes(step);
        FOR counter IN 0..step - 1
            LOOP
                alphabetIndex := (get_byte(bytes, counter) & mask) + 1;
                IF alphabetIndex <= alphabetLength THEN
                    idBuilder := idBuilder || alphabetArray[alphabetIndex];
                    IF length(idBuilder) = size THEN
                        RETURN idBuilder;
                    END IF;
                END IF;
            END LOOP;
    END LOOP;
END
$$;


ALTER FUNCTION "public"."nanoid_optimized"("size" integer, "alphabet" "text", "mask" integer, "step" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."business" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "ein" character varying(255),
    "avatar_url" character varying(255),
    "business_name" character varying(255) NOT NULL,
    "business_email" character varying(255),
    "business_phone" character varying(255),
    "business_url" "text",
    "business_image" "text",
    "business_meta" "jsonb",
    "business_currency" "text",
    "category" "text",
    "business_handle" "text",
    "business_affiliates" "jsonb",
    "stripe" "jsonb",
    "industry" character varying(255),
    "street_address" character varying(255),
    "city" character varying(255),
    "state" character varying(255),
    "postal_code" character varying(255),
    "country" character varying(255),
    "owner_id" "uuid",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "referral_code" "text",
    "document_classification" boolean DEFAULT false
);


ALTER TABLE "public"."business" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."business_users" (
    "id" integer NOT NULL,
    "business_id" "uuid",
    "user_id" "uuid",
    "role" character varying(255),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."business_users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."business_users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."business_users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."business_users_id_seq" OWNED BY "public"."business_users"."id";



CREATE TABLE IF NOT EXISTS "public"."referrals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "referrer_id" "uuid",
    "referred_id" "uuid",
    "referral_code" character varying(50) NOT NULL,
    "first_transaction_completed" boolean DEFAULT false,
    "referral_status" character varying(20) DEFAULT 'pending'::character varying,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "rewarded_at" timestamp without time zone,
    "is_affiliate" boolean DEFAULT false,
    "total_commission" numeric DEFAULT 0
);


ALTER TABLE "public"."referrals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_id" "uuid",
    "email" "text",
    "role" "public"."teamRoles",
    "code" "text" DEFAULT "public"."nanoid"(24),
    "invited_by" "uuid"
);


ALTER TABLE "public"."user_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "address" "jsonb",
    "phone" "text",
    "payment_method" "jsonb",
    "info" "jsonb",
    "details" "jsonb",
    "metadata" "jsonb",
    "stripe" "jsonb",
    "status" "public"."user_status" DEFAULT 'OFFLINE'::"public"."user_status",
    "kyc" "public"."kyc_status" DEFAULT 'pending'::"public"."kyc_status",
    "profile_status" "public"."profile_status" DEFAULT 'pending'::"public"."profile_status",
    "referral_code" "text",
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);

ALTER TABLE ONLY "public"."users" REPLICA IDENTITY FULL;


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'Profile data for each user.';



COMMENT ON COLUMN "public"."users"."id" IS 'References the internal Supabase Auth user.';



ALTER TABLE ONLY "public"."business_users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."business_users_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."business"
    ADD CONSTRAINT "business_business_handle_key" UNIQUE ("business_handle");



ALTER TABLE ONLY "public"."business"
    ADD CONSTRAINT "business_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."business"
    ADD CONSTRAINT "business_referral_code_key" UNIQUE ("referral_code");



ALTER TABLE ONLY "public"."business_users"
    ADD CONSTRAINT "business_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_referral_code_key" UNIQUE ("referral_code");



ALTER TABLE ONLY "public"."business"
    ADD CONSTRAINT "business_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."business_users"
    ADD CONSTRAINT "business_users_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id");



ALTER TABLE ONLY "public"."business_users"
    ADD CONSTRAINT "business_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."user_invites"
    ADD CONSTRAINT "user_invites_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_invites"
    ADD CONSTRAINT "user_invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



CREATE POLICY "Allow  business_users logged-in read access" ON "public"."business_users" FOR SELECT USING ((("auth"."jwt"() ->> 'business_id'::"text") = ("business_id")::"text"));



CREATE POLICY "Allow auth admin to read user roles" ON "public"."business_users" FOR SELECT TO "supabase_auth_admin" USING (true);



CREATE POLICY "Allow business individual update access" ON "public"."business" FOR UPDATE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Allow business logged-in read access" ON "public"."business" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow individual insert access" ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Allow individual update access" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Allow logged-in read access" ON "public"."users" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "User Invites can be created by a member of the team" ON "public"."user_invites" FOR INSERT WITH CHECK (("business_id" IN ( SELECT "private"."get_teams_for_authenticated_user"() AS "get_teams_for_authenticated_user")));



CREATE POLICY "User Invites can be deleted by a member of the team" ON "public"."user_invites" FOR DELETE USING (("business_id" IN ( SELECT "private"."get_teams_for_authenticated_user"() AS "get_teams_for_authenticated_user")));



CREATE POLICY "User Invites can be deleted by invited email" ON "public"."user_invites" FOR DELETE USING ((("auth"."jwt"() ->> 'email'::"text") = "email"));



CREATE POLICY "User Invites can be selected by a member of the team" ON "public"."user_invites" FOR SELECT USING (("business_id" IN ( SELECT "private"."get_teams_for_authenticated_user"() AS "get_teams_for_authenticated_user")));



CREATE POLICY "User Invites can be updated by a member of the team" ON "public"."user_invites" FOR UPDATE USING (("business_id" IN ( SELECT "private"."get_teams_for_authenticated_user"() AS "get_teams_for_authenticated_user")));



ALTER TABLE "public"."business" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."business_users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_own_referrals" ON "public"."referrals" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."user_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";
























































































































GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";




















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "industry" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "industry" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_business"("business_name" character varying, "industry" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "supabase_auth_admin";



GRANT ALL ON FUNCTION "public"."generate_referral_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_referral_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_referral_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_jwt"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_jwt"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_jwt"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("user_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("user_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("user_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_referrals"("user_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_referrals"("user_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_referrals"("user_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."nanoid"("size" integer, "alphabet" "text", "additionalbytesfactor" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."nanoid"("size" integer, "alphabet" "text", "additionalbytesfactor" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."nanoid"("size" integer, "alphabet" "text", "additionalbytesfactor" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."nanoid_optimized"("size" integer, "alphabet" "text", "mask" integer, "step" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."nanoid_optimized"("size" integer, "alphabet" "text", "mask" integer, "step" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."nanoid_optimized"("size" integer, "alphabet" "text", "mask" integer, "step" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";



GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";





























































































GRANT ALL ON TABLE "public"."business" TO "anon";
GRANT ALL ON TABLE "public"."business" TO "authenticated";
GRANT ALL ON TABLE "public"."business" TO "service_role";
GRANT ALL ON TABLE "public"."business" TO "supabase_auth_admin";



GRANT ALL ON TABLE "public"."business_users" TO "anon";
GRANT ALL ON TABLE "public"."business_users" TO "authenticated";
GRANT ALL ON TABLE "public"."business_users" TO "service_role";
GRANT ALL ON TABLE "public"."business_users" TO "supabase_auth_admin";



GRANT ALL ON SEQUENCE "public"."business_users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."business_users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."business_users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."referrals" TO "anon";
GRANT ALL ON TABLE "public"."referrals" TO "authenticated";
GRANT ALL ON TABLE "public"."referrals" TO "service_role";



GRANT ALL ON TABLE "public"."user_invites" TO "anon";
GRANT ALL ON TABLE "public"."user_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."user_invites" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
