
/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */

begin;
  -- remove the realtime publication
  drop publication if exists supabase_realtime;

  -- re-create the publication but don't enable it for any tables
  create publication supabase_realtime;
commit;




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

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

-- install postgis
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "plv8" WITH SCHEMA "extensions";

