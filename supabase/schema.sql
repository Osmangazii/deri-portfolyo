-- ============================================================
-- Deri Portfolyo — Supabase şema referansı
-- PostgreSQL 15+ / Supabase. Bu dosya referans amaçlıdır;
-- Supabase Dashboard > SQL Editor üzerinden çalıştırılabilir.
-- ============================================================

-- ------------------------------------------------------------
-- Ürünler
-- ------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  price numeric not null check (price >= 0),
  category text not null,
  gender text not null check (gender in ('kadin', 'erkek', 'unisex')),
  images text[] not null default '{}',
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Profiller (auth.users ile 1:1)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Siparişler
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  total_amount numeric not null check (total_amount >= 0),
  status text not null default 'pending',
  customer_info jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Sipariş kalemleri
-- ------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  quantity integer not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0)
);

-- ------------------------------------------------------------
-- Admin yardımcı fonksiyonu
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- Row Level Security (RLS)
-- ------------------------------------------------------------
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Ürünler: herkes okuyabilir, yalnızca admin yazabilir
create policy "products_select_public" on public.products
  for select using (true);

create policy "products_insert_admin" on public.products
  for insert with check (public.is_admin());

create policy "products_update_admin" on public.products
  for update using (public.is_admin()) with check (public.is_admin());

create policy "products_delete_admin" on public.products
  for delete using (public.is_admin());

-- Profiller: kullanıcı kendi profilini okur/günceller, admin tümünü okur
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Siparişler: kullanıcı kendi siparişlerini görebilir/oluşturabilir, admin tümünü
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

-- Sipariş kalemleri: sahibinin siparişi üzerinden veya admin olarak okunur
create policy "order_items_select_via_order" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "order_items_insert_via_order" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.user_id = auth.uid()
    )
  );
