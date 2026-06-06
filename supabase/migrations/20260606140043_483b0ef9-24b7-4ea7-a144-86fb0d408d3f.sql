-- Lock down the has_role SECURITY DEFINER function so it isn't callable
-- directly from the public Data API by anon or authenticated users.
-- RLS policies still work because the function is SECURITY DEFINER and
-- continues to be evaluated by the policy engine.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;