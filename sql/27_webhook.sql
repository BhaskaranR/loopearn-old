CREATE OR REPLACE FUNCTION "public"."webhook"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    url text;
    secret text;
    payload jsonb;
    request_id bigint;
    signature text;
    path text;
BEGIN
    -- Extract the first item from TG_ARGV as path
    path = TG_ARGV[0];

    -- Get the webhook URL and secret from the vault
    SELECT decrypted_secret INTO url FROM vault.decrypted_secrets WHERE name = 'WEBHOOK_ENDPOINT' LIMIT 1;
    SELECT decrypted_secret INTO secret FROM vault.decrypted_secrets WHERE name = 'WEBHOOK_SECRET' LIMIT 1;

    RAISE LOG 'Generate new webhook';
    RAISE LOG 'webhook url: %', url;
    RAISE LOG 'webhook secret: %', secret;

    -- Generate the payload
    payload = jsonb_build_object(
        'old_record', old,
        'record', new,
        'type', tg_op,
        'table', tg_table_name,
        'schema', tg_table_schema
    );

    -- Generate the signature
    signature = generate_hmac(secret, payload::text);

    RAISE LOG 'webhookpayload: %', payload;
    RAISE LOG 'signature: %', signature;

    -- Send the webhook request
    SELECT http_post
    INTO request_id
    FROM
        net.http_post(
                url :=  url || '/' || path,
                body := payload,
                headers := jsonb_build_object(
                        'Content-Type', 'application/json',
                        'X-Supabase-Signature', signature
                ),
               timeout_milliseconds := 3000
        );

    -- Insert the request ID into the Supabase hooks table
    -- INSERT INTO supabase_functions.hooks
    --     (hook_table_id, hook_name, request_id)
    -- VALUES (tg_relid, tg_name, request_id);
    RAISE LOG 'webhook request_id: %', request_id;

    RETURN new;
END;
$$;

ALTER FUNCTION "public"."webhook"() OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."webhook"() TO "anon";
GRANT ALL ON FUNCTION "public"."webhook"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."webhook"() TO "service_role";


CREATE TRIGGER user_registered AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION webhook('webhook/registered');
