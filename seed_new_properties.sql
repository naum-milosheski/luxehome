
-- Seed New Luxury Properties

-- 1. The Aspen Summit Lodge (Marcus Thorne)
INSERT INTO properties (title, address, price, beds, baths, sqft, image, amenities, user_id)
VALUES (
    'The Aspen Summit Lodge',
    '123 Alpine Way, Aspen, CO 81611',
    14500000,
    5,
    6,
    4500,
    '["/aspen-lodge.png", "/aspen-lodge.png", "/aspen-lodge.png", "/aspen-lodge.png", "/aspen-lodge.png"]',
    '{"mountainView": true, "fireplace": true, "sauna": true, "spa": true, "parking": true}',
    (SELECT id FROM profiles WHERE full_name = 'Marcus Thorne' LIMIT 1)
);

-- 2. Silicon Valley Glass Cube (Elena Vance)
INSERT INTO properties (title, address, price, beds, baths, sqft, image, amenities, user_id)
VALUES (
    'Silicon Valley Glass Cube',
    '456 Tech Blvd, Palo Alto, CA 94301',
    8200000,
    4,
    4,
    3200,
    '["/silicon-cube.png", "/silicon-cube.png", "/silicon-cube.png", "/silicon-cube.png", "/silicon-cube.png"]',
    '{"smartHome": true, "homeTheater": true, "infinityPool": true, "gym": true, "security": true}',
    (SELECT id FROM profiles WHERE full_name = 'Elena Vance' LIMIT 1)
);

-- 3. The Hamptons Heritage Estate (James Sterling)
INSERT INTO properties (title, address, price, beds, baths, sqft, image, amenities, user_id)
VALUES (
    'The Hamptons Heritage Estate',
    '789 Ocean Drive, Southampton, NY 11968',
    22000000,
    8,
    9,
    8500,
    '["/hamptons-estate.png", "/hamptons-estate.png", "/hamptons-estate.png", "/hamptons-estate.png", "/hamptons-estate.png"]',
    '{"wineCellar": true, "gatedCommunity": true, "guestHouse": true, "pool": true, "waterfront": true}',
    (SELECT id FROM profiles WHERE full_name = 'James Sterling' LIMIT 1)
);
