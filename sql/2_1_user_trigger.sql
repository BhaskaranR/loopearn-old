CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
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



CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  business_id uuid;
  new_referral_code TEXT;
  referrer_id uuid;
  onboarding_status public.onboarding_status := 'complete';
BEGIN
  SELECT id, referral_code INTO  business_id, new_referral_code
    FROM
      public.business
    WHERE
      business_name = NEW.raw_user_meta_data ->> 'companyName';

  IF new_referral_code IS NULL THEN
    new_referral_code := public.generate_referral_code();
  END IF;
  
  -- if business account insert into company table & company users table
  IF (NEW.raw_user_meta_data ->> 'companyName' IS NOT NULL) THEN
    IF business_id IS NOT NULL THEN
      RAISE EXCEPTION 'This company already exists. Please reach out to your company administrator for an invitation and to enable your account.';
    END IF;
    INSERT INTO public.business(
      business_name,
      business_email,
      slug,
      referral_code)
    VALUES (
      NEW.raw_user_meta_data ->> 'companyName',
      NEW.email,
      NEW.raw_user_meta_data ->> 'slug',
      new_referral_code)
    RETURNING
    id INTO business_id;

    onboarding_status := 'pending';
  END IF;

  INSERT INTO public.users(
    id,
    username,
    business_id,
    full_name,
    phone,
    metadata,
    avatar_url,
    onboarding_status,
    referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    business_id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data,
    NEW.raw_user_meta_data ->> 'avatar_url',
    onboarding_status,
    new_referral_code
    );

  -- if business account insert into company table & company users table
  IF (business_id IS NOT NULL) THEN
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

  -- TODO implement referral code later
  -- RAISE LOG 'Referral Code: %', NEW.raw_user_meta_data ->> 'referral_code';
  -- if (NEW.raw_user_meta_data ->> 'referral_code' IS NOT NULL) THEN
  --   referrer_id := public.get_user_id_by_ref_code(NEW.raw_user_meta_data ->> 'referral_code');

  --   if (referrer_id  IS NOT NULL) THEN
  --     INSERT INTO public.referrals(
  --       referrer_id,
  --       referred_id,
  --       referral_code)
  --     VALUES (
  --       referrer_id,
  --       NEW.id,
  --       NEW.raw_user_meta_data ->> 'referral_code');
  --   END IF;
  -- END IF;
  RETURN new;
END;
$function$;


-- trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

