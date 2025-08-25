-- Business Policies

DROP POLICY IF EXISTS "Allow business owner update access" ON public.business;
CREATE POLICY "Allow business owner update access" ON public.business
  FOR UPDATE
  USING (
    public.is_user_in_business(id) AND 
    public.get_user_role_in_business(id) = 'owner'
  );

DROP POLICY IF EXISTS "Allow business owner delete access" ON public.business;
CREATE POLICY "Allow business owner delete access" ON public.business
  FOR DELETE
  TO authenticated
  USING (
    public.get_user_role_in_business(id) = 'owner'
  );

DROP POLICY IF EXISTS "Allow business_users logged-in read access" ON public.business_users;
CREATE POLICY "Allow business_users logged-in read access" ON public.business_users
  FOR SELECT
  TO authenticated
  USING (
    public.is_user_in_business(business_id)
  );

DROP POLICY IF EXISTS "Allow business_users owner delete access" ON public.business_users;
CREATE POLICY "Allow business_users owner delete access" ON public.business_users
  FOR DELETE
  TO authenticated
  USING (
    public.get_user_role_in_business(business_id) = 'owner'
  );

GRANT EXECUTE ON FUNCTION public.get_jwt() TO authenticated;