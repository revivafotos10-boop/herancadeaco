REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
CREATE UNIQUE INDEX products_slug_unique_idx ON public.products (slug) WHERE slug IS NOT NULL;
CREATE INDEX products_active_created_at_idx ON public.products (active, created_at DESC);
CREATE INDEX home_banners_active_sort_order_idx ON public.home_banners (active, sort_order);