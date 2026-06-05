
-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 2. Products: lock writes to admins
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

-- 3. Home banners: lock writes to admins
DROP POLICY IF EXISTS "Admins can manage home banners" ON public.home_banners;

CREATE POLICY "Admins can insert banners" ON public.home_banners
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update banners" ON public.home_banners
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete banners" ON public.home_banners
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

GRANT INSERT, UPDATE, DELETE ON public.home_banners TO authenticated;

-- 4. Storage policies: lock writes/deletes to admins, keep public reads
-- products bucket
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

CREATE POLICY "Admins upload products" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update products" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete products" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));

-- product-images bucket
DROP POLICY IF EXISTS "Public can upload to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete product-images" ON storage.objects;

CREATE POLICY "Admins upload product-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update product-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete product-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- generic admin writes for banners/symbols/header/favicon
CREATE POLICY "Admins upload media buckets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('banners','symbols','header','favicon') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media buckets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('banners','symbols','header','favicon') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media buckets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('banners','symbols','header','favicon') AND public.has_role(auth.uid(), 'admin'));
