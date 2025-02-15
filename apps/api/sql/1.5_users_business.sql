// ... existing code ...
CREATE OR REPLACE FUNCTION is_user_in_business(p_business_id uuid)
RETURNS boolean
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.business_users
        WHERE user_id = auth.uid() AND business_id = p_business_id
    );
END;
$$ LANGUAGE plpgsql;
// ... existing code ...

GRANT EXECUTE ON FUNCTION public.is_user_in_business(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_in_business(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.is_user_in_business(uuid) TO service_role;


CREATE OR REPLACE FUNCTION public.get_user_role_in_business(p_business_id uuid) 
RETURNS text
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT role
        FROM public.business_users
        WHERE user_id = auth.uid() AND business_id = p_business_id
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role_in_business(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role_in_business(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_role_in_business(uuid) TO service_role;

CREATE OR REPLACE FUNCTION "private"."get_businesses_for_authenticated_user"() RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select business_id
  from business_users
  where user_id = auth.uid()
$$;


ALTER FUNCTION "private"."get_businesses_for_authenticated_user"() OWNER TO "postgres";
