-- ============================================================
-- AUTO-HEALING DEMO DATABASE
-- Resets demo data to golden state every 30 minutes
-- ============================================================

-- Create the reset function
CREATE OR REPLACE FUNCTION public.reset_demo_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  demo_user_id uuid;
BEGIN
  -- Find the demo user
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@luxehome.com';
  
  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'Demo user not found, skipping reset';
    RETURN;
  END IF;

  -- ============================================================
  -- 1. CLEAN UP EXISTING DEMO DATA
  -- ============================================================
  DELETE FROM public.leads WHERE agent_id = demo_user_id;
  DELETE FROM public.properties WHERE user_id = demo_user_id;
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
  );

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
  );

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
  );

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
  );

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
     'Saw your listing on Instagram. Looking for my first home.', 'New', 45, demo_user_id, now() - interval '6 hours');

  RAISE NOTICE '✅ Demo data reset successfully at %', now();
END;
$$;

-- ============================================================
-- SCHEDULE CRON JOB (every 30 minutes)
-- ============================================================

-- Remove existing job if it exists (for idempotency)
SELECT cron.unschedule('reset-demo-data') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'reset-demo-data'
);

-- Schedule the job to run every 30 minutes
SELECT cron.schedule(
  'reset-demo-data',           -- job name
  '*/30 * * * *',              -- every 30 minutes
  'SELECT public.reset_demo_data();'
);

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.reset_demo_data() TO service_role;
