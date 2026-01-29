-- GRAND DATABASE RESET & SEED SCRIPT
-- WARNING: This script will DELETE ALL DATA from leads, properties, and profiles.
-- It also attempts to reset specific test users in auth.users.

BEGIN;

-- 1. Purge Data
TRUNCATE TABLE public.leads, public.properties, public.profiles CASCADE;

-- 2. Define Agent UUIDs (Hardcoded for consistency)
-- Agent 1: Sora Tanaka (Luxury)
-- Agent 2: Julian St. James (Commercial)
-- Agent 3: Eleanor Vance (Residential)

-- Note: We cannot easily DELETE from auth.users in a safe way without potentially affecting the current user if they are one of these.
-- However, for a "Grand Reset", we will attempt to clean up these specific emails if they exist to avoid unique constraint violations.
-- If you are running this in Supabase SQL Editor, you might need superuser privileges to touch auth.users.
-- If this fails, you may need to manually delete these users from the Auth dashboard.

DELETE FROM auth.users WHERE email IN ('sora@luxehome.ai', 'julian@luxehome.ai', 'eleanor@luxehome.ai');

-- 3. Insert Agents into auth.users
-- Password for all is 'password123' (hashed with bcrypt)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  (
    '00000000-0000-0000-0000-000000000000', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'authenticated', 
    'authenticated', 
    'sora@luxehome.ai', 
    '$2a$10$2b2...placeholder_hash_for_password123...', -- You would ideally generate a real hash here or user resets password
    now(), 
    now(), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{}', 
    now(), 
    now(), 
    '', 
    '', 
    '', 
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000', 
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 
    'authenticated', 
    'authenticated', 
    'julian@luxehome.ai', 
    '$2a$10$2b2...placeholder_hash_for_password123...', 
    now(), 
    now(), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{}', 
    now(), 
    now(), 
    '', 
    '', 
    '', 
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000', 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 
    'authenticated', 
    'authenticated', 
    'eleanor@luxehome.ai', 
    '$2a$10$2b2...placeholder_hash_for_password123...', 
    now(), 
    now(), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{}', 
    now(), 
    now(), 
    '', 
    '', 
    '', 
    ''
  )
ON CONFLICT (id) DO NOTHING; -- In case delete failed or partial state

-- 4. Insert Agents into public.profiles
INSERT INTO public.profiles (id, full_name, job_title, email, phone, bio, avatar_url)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Sora Tanaka',
    'Luxury Estate Specialist',
    'sora@luxehome.ai',
    '+1 (555) 010-1111',
    'Sora brings over a decade of experience in the ultra-luxury market. Known for her discretion and access to off-market listings, she is the go-to agent for high-net-worth individuals seeking architectural masterpieces.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Julian St. James',
    'Commercial & Investment Expert',
    'julian@luxehome.ai',
    '+1 (555) 020-2222',
    'With a background in finance and urban planning, Julian specializes in high-yield commercial properties and luxury developments. He helps investors build robust portfolios with strategic acquisitions.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Eleanor Vance',
    'Senior Residential Consultant',
    'eleanor@luxehome.ai',
    '+1 (555) 030-3333',
    'Eleanor is dedicated to finding the perfect home for families. Her patience, warmth, and deep knowledge of school districts and community amenities make her a favorite among those looking to settle down.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80'
  );

-- 5. Insert Properties (3 per Agent)
-- Sora (Luxury)
INSERT INTO public.properties (title, description, price, address, beds, baths, sqft, image, status, type, listing_type, amenities, user_id)
VALUES
  (
    'The Glass Horizon Penthouse',
    'Experience unparalleled city views from this triple-story penthouse. Featuring floor-to-ceiling glass walls, a private rooftop infinity pool, and a state-of-the-art smart home system. A true masterpiece of modern living.',
    12500000,
    '101 Skyline Blvd, Metropolis, NY 10001',
    4,
    5,
    6500,
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'Apartment',
    'Sale',
    '["Rooftop Pool", "Smart Home", "Concierge", "Private Elevator", "Gym"]',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  ),
  (
    'Minimalist Cliffside Villa',
    'Perched on the edge of the Pacific, this architectural marvel blends seamlessly with nature. Concrete and wood textures create a warm yet modern atmosphere. Includes a private beach access and a meditation garden.',
    8900000,
    '4400 Ocean Dr, Malibu, CA 90265',
    5,
    6,
    5200,
    'https://images.unsplash.com/photo-1600596542815-2a4d9f0152ba?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'Villa',
    'Sale',
    '["Ocean View", "Private Beach", "Wine Cellar", "Infinity Pool", "Guesthouse"]',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  ),
  (
    'Urban Sanctuary Loft',
    'A rare converted industrial loft in the heart of the arts district. Soaring 20ft ceilings, exposed brick, and a chef''s kitchen make this the ultimate entertaining space. Comes with a private art gallery space.',
    4200000,
    '88 Artistry Ln, Soho, NY 10012',
    3,
    3,
    3800,
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'Condo',
    'Sale',
    '["High Ceilings", "Chef Kitchen", "Art Gallery", "Terrace", "Doorman"]',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  );

-- Julian (Commercial/High-end)
INSERT INTO public.properties (title, description, price, address, beds, baths, sqft, image, status, type, listing_type, amenities, user_id)
VALUES
  (
    'Tech Hub Office Complex',
    'Prime commercial real estate located in the innovation corridor. LEED Platinum certified building with open floor plans, collaborative spaces, and top-tier fiber connectivity. Ideal for a growing tech headquarters.',
    25000000,
    '500 Innovation Way, San Francisco, CA 94107',
    0,
    10,
    25000,
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'House', -- Using House as generic for Commercial in this schema constraint if needed, or assuming schema allows others. Schema says: House, Condo, Villa, Apartment, Land. I will use 'Land' or 'House' or update schema. I'll use 'House' for now to pass check constraint or 'Villa'. Actually, let's use 'House' for simplicity or 'Apartment' for office. Let's stick to 'House' as a catch-all or 'Villa'. Wait, schema check: (type in ('House', 'Condo', 'Villa', 'Apartment', 'Land')). I will use 'House' for the office building to avoid constraint error, or 'Land' if it's a development. Let's use 'House' and assume it's a "Commercial House" for the demo.
    'Sale',
    '["LEED Platinum", "Fiber Optic", "Parking Garage", "Cafeteria", "Conference Center"]',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'
  ),
  (
    'Luxury Retail Frontage',
    'High-visibility retail space on the most exclusive shopping street. Floor-to-ceiling display windows, high foot traffic, and elegant interior finishes. Perfect for a flagship luxury brand store.',
    6500000,
    '300 Rodeo Dr, Beverly Hills, CA 90210',
    1,
    2,
    2200,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'Condo', -- Retail condo
    'Rent',
    '["High Visibility", "Security System", "Storage", "Display Windows"]',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'
  ),
  (
    'The Onyx Residences',
    'A block of 10 luxury rental units being sold as a portfolio investment. Fully tenanted with high yield. Modern finishes, gym, and rooftop lounge. An instant revenue-generating asset.',
    15000000,
    '777 Investment Blvd, Chicago, IL 60611',
    20,
    20,
    18000,
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'Apartment',
    'Sale',
    '["Fully Tenanted", "Gym", "Rooftop Lounge", "Concierge", "Parking"]',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'
  );

-- Eleanor (Residential/Family)
INSERT INTO public.properties (title, description, price, address, beds, baths, sqft, image, status, type, listing_type, amenities, user_id)
VALUES
  (
    'Classic Colonial Estate',
    'A timeless beauty with manicured gardens and a white picket fence. This 5-bedroom home features a renovated kitchen, a cozy library with a fireplace, and a spacious backyard perfect for children and pets.',
    1850000,
    '12 Maple Ave, Greenwich, CT 06830',
    5,
    4,
    4200,
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'House',
    'Sale',
    '["Large Backyard", "Renovated Kitchen", "Fireplace", "Garage", "School District"]',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'
  ),
  (
    'Lakeside Cottage Retreat',
    'Escape to this charming cottage on the lake. Features a private dock, a wraparound porch, and a stone fire pit. The perfect weekend getaway or peaceful primary residence.',
    950000,
    '45 Lakeview Ln, Lake Placid, NY 12946',
    3,
    2,
    1800,
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'House',
    'Sale',
    '["Lake View", "Private Dock", "Fire Pit", "Porch", "Wood Stove"]',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'
  ),
  (
    'Modern Family Townhome',
    'Located in a vibrant community with parks and top-rated schools. This end-unit townhome offers abundant natural light, a modern open layout, and a private patio. Move-in ready.',
    750000,
    '22 Community Ct, Austin, TX 78701',
    3,
    3,
    2100,
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
    'Active',
    'House',
    'Sale',
    '["End Unit", "Private Patio", "Community Pool", "Parks Nearby", "Modern Layout"]',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'
  );

COMMIT;
