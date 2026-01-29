-- ============================================================
-- DEMO ACCOUNT SEED SCRIPT
-- Creates a rich demo experience for portfolio showcases
-- ============================================================
-- 
-- PREREQUISITE: Create the demo user in Supabase Dashboard first!
-- ─────────────────────────────────────────────────────────────
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User" → "Create New User"
-- 3. Email: demo@luxehome.com | Password: demo123
-- 4. ✅ Check "Auto Confirm User"
-- 5. Click "Create User"
-- 6. Run this script - it will find the user automatically!
--
-- ============================================================

-- Automatically find the demo user by email
DO $$
DECLARE
  demo_user_id uuid;
BEGIN
  -- Look up the demo user ID by email
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@luxehome.com';
  
  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'Demo user not found! Please create demo@luxehome.com in Supabase Auth first.';
  END IF;

  RAISE NOTICE 'Found demo user: %', demo_user_id;

  -- ============================================================
  -- 1. CLEAN UP EXISTING DEMO DATA
  -- ============================================================
  DELETE FROM public.leads WHERE id IN (
    'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380d04',
    'd5eebc99-9c0b-4ef8-bb6d-6bb9bd380d05',
    'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380d06',
    'd7eebc99-9c0b-4ef8-bb6d-6bb9bd380d07',
    'd8eebc99-9c0b-4ef8-bb6d-6bb9bd380d08'
  );
  DELETE FROM public.properties WHERE id IN (
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380d02',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d03'
  );
  DELETE FROM public.profiles WHERE id = demo_user_id;

  -- ============================================================
  -- 2. CREATE DEMO PROFILE
  -- ============================================================
  INSERT INTO public.profiles (id, full_name, job_title, email, phone, bio, avatar_url)
  VALUES (
    demo_user_id,
    'Demo Agent',
    'Luxury Real Estate Specialist',
    'demo@luxehome.com',
    '+1 (555) 000-DEMO',
    'Welcome to LuxeHome AI! This demo account showcases the platform''s capabilities.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  ) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    job_title = EXCLUDED.job_title,
    bio = EXCLUDED.bio;

  -- ============================================================
  -- 3. SEED PROPERTIES
  -- ============================================================

  -- Property 1: ACTIVE - Coastal Villa
  INSERT INTO public.properties (id, title, description, price, address, beds, baths, sqft, image, status, type, listing_type, amenities, user_id, created_at)
  VALUES (
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    'The Azure Coastline Estate',
    'A breathtaking oceanfront masterpiece featuring floor-to-ceiling windows and state-of-the-art smart home automation.',
    8750000, '2800 Pacific Coast Hwy, Malibu, CA 90265',
    5, 6, 5800,
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    'Active', 'Villa', 'Sale',
    '["Ocean View", "Infinity Pool", "Smart Home", "Wine Cellar", "Home Theater"]',
    demo_user_id, now() - interval '3 days'
  ) ON CONFLICT (id) DO NOTHING;

  -- Property 2: ARCHIVED - Urban Penthouse
  INSERT INTO public.properties (id, title, description, price, address, beds, baths, sqft, image, status, type, listing_type, amenities, user_id, created_at)
  VALUES (
    'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380d02',
    'The Obsidian Sky Penthouse',
    'Triple-level penthouse with 360-degree skyline views, private elevator, and rooftop garden.',
    12500000, '1 Central Park South, Penthouse A, New York, NY 10019',
    4, 5, 6200,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    'Archived', 'Apartment', 'Sale',
    '["Private Elevator", "Rooftop Garden", "Concierge", "City Views", "Spa"]',
    demo_user_id, now() - interval '12 days'
  ) ON CONFLICT (id) DO NOTHING;

  -- Property 3: ARCHIVED - Historic Estate
  INSERT INTO public.properties (id, title, description, price, address, beds, baths, sqft, image, status, type, listing_type, amenities, user_id, created_at)
  VALUES (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d03',
    'The Kensington Manor',
    'Meticulously restored 1920s Georgian estate on 5 acres with original architectural details.',
    4250000, '450 Old Greenwich Rd, Greenwich, CT 06830',
    7, 8, 9500,
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
    'Archived', 'House', 'Sale',
    '["Tennis Court", "Guest House", "Gardens", "Library", "Wine Cellar"]',
    demo_user_id, now() - interval '45 days'
  ) ON CONFLICT (id) DO NOTHING;

  -- ============================================================
  -- 4. SEED LEADS
  -- ============================================================

  INSERT INTO public.leads (id, name, email, phone, message, status, score, agent_id, created_at)
  VALUES
    ('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380d04', 'Victoria Chen', 'v.chen@techfounders.com', '+1 (415) 555-8821',
     'Relocating from SF. Looking for 6+ bedrooms with home office.', 'New', 92, demo_user_id, now() - interval '2 hours'),
    ('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380d05', 'Marcus Williams', 'marcus.w@williams-capital.com', '+1 (310) 555-4492',
     'The Azure Coastline Estate is exactly what we need.', 'Contacted', 88, demo_user_id, now() - interval '1 day'),
    ('d6eebc99-9c0b-4ef8-bb6d-6bb9bd380d06', 'Sophie Laurent', 'sophie.laurent@banqueprivee.ch', '+41 22 555 0033',
     'Looking to acquire 2-3 properties. All-cash buyer, up to $25M.', 'Qualified', 95, demo_user_id, now() - interval '5 days'),
    ('d7eebc99-9c0b-4ef8-bb6d-6bb9bd380d07', 'Jonathan Hartwell', 'jhartwell@hartwell-group.com', '+1 (203) 555-7701',
     'Congratulations on the closing! Manor exceeded expectations.', 'Closed', 100, demo_user_id, now() - interval '30 days'),
    ('d8eebc99-9c0b-4ef8-bb6d-6bb9bd380d08', 'David Park', 'dpark@gmail.com', '+1 (212) 555-3344',
     'Saw your listing on Instagram. Looking for my first home.', 'New', 45, demo_user_id, now() - interval '6 hours')
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE '✅ Demo data seeded successfully!';

END $$;
