
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  description text,
  price numeric not null default 0,
  old_price numeric,
  size_cm text,
  material text,
  handle_material text,
  features text[] default '{}',
  image_url text,
  gallery_images text[] default '{}',
  active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.products enable row level security;

create policy "Public can read products"
  on public.products for select
  using (true);

create policy "Anyone can insert products"
  on public.products for insert
  with check (true);

create policy "Anyone can update products"
  on public.products for update
  using (true);

create policy "Anyone can delete products"
  on public.products for delete
  using (true);

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Anyone can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'products');

create policy "Anyone can update product images"
  on storage.objects for update
  using (bucket_id = 'products');

create policy "Anyone can delete product images"
  on storage.objects for delete
  using (bucket_id = 'products');
