-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Properties Table
create table if not exists public.properties (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric,
  address text,
  beds integer,
  baths integer,
  sqft integer,
  image text,
  status text check (status in ('Draft', 'Active', 'Archived')),
  type text check (type in ('House', 'Condo', 'Villa', 'Apartment', 'Land')),
  listing_type text check (listing_type in ('Sale', 'Rent')),
  amenities jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Leads Table
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  message text,
  status text check (status in ('New', 'Contacted', 'Qualified', 'Closed')) default 'New',
  score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.properties enable row level security;
alter table public.leads enable row level security;

-- Create Policies (Open for now for simplicity, or restrict as needed)
-- Allow public read access to active properties
create policy "Public properties are viewable by everyone"
  on public.properties for select
  using (true);

-- Allow authenticated users (admin) to insert/update/delete properties
create policy "Users can insert properties"
  on public.properties for insert
  with check (true); -- For now allow anon insert for demo purposes if needed, or restrict to auth

create policy "Users can update properties"
  on public.properties for update
  using (true);

-- Allow public to insert leads
create policy "Public can insert leads"
  on public.leads for insert
  with check (true);

-- Allow admin to view leads
create policy "Users can view leads"
  on public.leads for select
  using (true);

-- Create Storage Bucket for Properties
insert into storage.buckets (id, name, public)
values ('properties', 'properties', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'properties' );

create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'properties' );
