alter table "public"."users" add column "locale" text default 'en'::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
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
        SELECT 1 FROM users u WHERE u.referral_code = %L
      ) OR EXISTS (
        SELECT 1 FROM business b WHERE b.referral_code = %L
      )', referral_code, referral_code)
    INTO referral_code_exists;

    -- If the referral code doesn't exist in either table, exit the loop
    EXIT WHEN NOT referral_code_exists;
  END LOOP;

  RETURN referral_code;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
    new_referral_code := generate_referral_code();
  end IF;

  RAISE LOG 'Generated referral code: %', new_referral_code;
  IF (NEW.raw_user_meta_data ->> 'is_invite' IS NOT NULL) THEN
    -- call
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
$function$
;


