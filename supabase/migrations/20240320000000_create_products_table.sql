
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  description text,
  price numeric not null,
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

-- Enable RLS
alter table products enable row level security;

-- Create policies
create policy "Allow public read access" on products
  for select using (true);

create policy "Allow all for authenticated users" on products
  for all using (auth.role() = 'authenticated');

