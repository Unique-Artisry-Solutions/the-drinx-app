
-- Step 1: Add missing columns to swig_circuits table
ALTER TABLE swig_circuits ADD COLUMN IF NOT EXISTS location_details JSONB DEFAULT '{}';
ALTER TABLE swig_circuits ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE swig_circuits ADD COLUMN IF NOT EXISTS time TEXT;
ALTER TABLE swig_circuits ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE swig_circuits ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE swig_circuits ADD COLUMN IF NOT EXISTS max_participants INTEGER;

-- Step 2: Add missing columns to establishments table if they don't exist
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS distance TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS distance_value NUMERIC;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS cocktail_count INTEGER DEFAULT 0;

-- Step 3: Create test establishments within 1 mile of user location (Washington DC area)
-- User coordinates: lat 38.99835403680493, long -77.03226394376655
DO $$
BEGIN
    -- Only insert if establishments don't already exist
    IF NOT EXISTS (SELECT 1 FROM establishments WHERE name = 'Downtown Mocktail Bar') THEN
        INSERT INTO establishments (
            id, name, address, latitude, longitude, distance, distance_value, cocktail_count, created_at
        ) VALUES (
            gen_random_uuid(), 'Downtown Mocktail Bar', '1200 18th St NW, Washington, DC 20036',
            38.9995, -77.0425, '0.8 mi', 0.8, 15, now()
        );
    ELSE
        UPDATE establishments SET 
            latitude = 38.9995,
            longitude = -77.0425,
            distance = '0.8 mi',
            distance_value = 0.8,
            cocktail_count = 15
        WHERE name = 'Downtown Mocktail Bar';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM establishments WHERE name = 'Dupont Circle Juice Bar') THEN
        INSERT INTO establishments (
            id, name, address, latitude, longitude, distance, distance_value, cocktail_count, created_at
        ) VALUES (
            gen_random_uuid(), 'Dupont Circle Juice Bar', '1640 Connecticut Ave NW, Washington, DC 20009',
            39.0045, -77.0377, '0.6 mi', 0.6, 12, now()
        );
    ELSE
        UPDATE establishments SET 
            latitude = 39.0045,
            longitude = -77.0377,
            distance = '0.6 mi',
            distance_value = 0.6,
            cocktail_count = 12
        WHERE name = 'Dupont Circle Juice Bar';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM establishments WHERE name = 'Adams Morgan Wellness Cafe') THEN
        INSERT INTO establishments (
            id, name, address, latitude, longitude, distance, distance_value, cocktail_count, created_at
        ) VALUES (
            gen_random_uuid(), 'Adams Morgan Wellness Cafe', '2423 18th St NW, Washington, DC 20009',
            38.9201, -77.0420, '0.9 mi', 0.9, 8, now()
        );
    ELSE
        UPDATE establishments SET 
            latitude = 38.9201,
            longitude = -77.0420,
            distance = '0.9 mi',
            distance_value = 0.9,
            cocktail_count = 8
        WHERE name = 'Adams Morgan Wellness Cafe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM establishments WHERE name = 'Capitol Hill Kombucha Bar') THEN
        INSERT INTO establishments (
            id, name, address, latitude, longitude, distance, distance_value, cocktail_count, created_at
        ) VALUES (
            gen_random_uuid(), 'Capitol Hill Kombucha Bar', '500 8th St SE, Washington, DC 20003',
            38.9934, -77.0051, '0.7 mi', 0.7, 20, now()
        );
    ELSE
        UPDATE establishments SET 
            latitude = 38.9934,
            longitude = -77.0051,
            distance = '0.7 mi',
            distance_value = 0.7,
            cocktail_count = 20
        WHERE name = 'Capitol Hill Kombucha Bar';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM establishments WHERE name = 'Georgetown Sober Lounge') THEN
        INSERT INTO establishments (
            id, name, address, latitude, longitude, distance, distance_value, cocktail_count, created_at
        ) VALUES (
            gen_random_uuid(), 'Georgetown Sober Lounge', '3135 M St NW, Washington, DC 20007',
            38.9054, -77.0637, '0.5 mi', 0.5, 18, now()
        );
    ELSE
        UPDATE establishments SET 
            latitude = 38.9054,
            longitude = -77.0637,
            distance = '0.5 mi',
            distance_value = 0.5,
            cocktail_count = 18
        WHERE name = 'Georgetown Sober Lounge';
    END IF;
END $$;

-- Step 4: Update existing swig circuits with location details and other missing data
UPDATE swig_circuits 
SET 
    location_details = jsonb_build_object(
        'start_location', jsonb_build_object(
            'name', 'Downtown DC',
            'address', '1200 18th St NW, Washington, DC',
            'latitude', 38.9995,
            'longitude', -77.0425
        ),
        'area', 'Downtown Washington DC',
        'radius_miles', 1.0,
        'estimated_duration', '3-4 hours'
    ),
    date = '2024-07-15',
    time = '14:00',
    status = 'published',
    max_participants = 25
WHERE name = 'Downtown Sober Circuit';

UPDATE swig_circuits 
SET 
    location_details = jsonb_build_object(
        'start_location', jsonb_build_object(
            'name', 'Dupont Circle',
            'address', '1640 Connecticut Ave NW, Washington, DC',
            'latitude', 39.0045,
            'longitude', -77.0377
        ),
        'area', 'Dupont Circle Area',
        'radius_miles', 0.8,
        'estimated_duration', '2-3 hours'
    ),
    date = '2024-07-20',
    time = '16:00',
    status = 'published',
    max_participants = 20
WHERE name = 'Wellness Weekend Circuit';

UPDATE swig_circuits 
SET 
    location_details = jsonb_build_object(
        'start_location', jsonb_build_object(
            'name', 'Georgetown',
            'address', '3135 M St NW, Washington, DC',
            'latitude', 38.9054,
            'longitude', -77.0637
        ),
        'area', 'Georgetown District',
        'radius_miles', 0.6,
        'estimated_duration', '2.5 hours'
    ),
    date = '2024-07-25',
    time = '18:00',
    status = 'published',
    max_participants = 15
WHERE name = 'Artisan Mocktail Trail';

-- Step 5: Update events with proper venue assignments and location details
UPDATE events 
SET 
    venue_id = (SELECT id FROM establishments WHERE name = 'Downtown Mocktail Bar' LIMIT 1),
    location_details = jsonb_build_object(
        'address', '1200 18th St NW',
        'city', 'Washington',
        'state', 'DC',
        'zip', '20036',
        'country', 'USA',
        'latitude', 38.9995,
        'longitude', -77.0425
    )
WHERE name = 'Sober Summer Fest 2024';

UPDATE events 
SET 
    venue_id = (SELECT id FROM establishments WHERE name = 'Dupont Circle Juice Bar' LIMIT 1),
    location_details = jsonb_build_object(
        'address', '1640 Connecticut Ave NW',
        'city', 'Washington',
        'state', 'DC',
        'zip', '20009',
        'country', 'USA',
        'latitude', 39.0045,
        'longitude', -77.0377
    )
WHERE name = 'Mocktail Mixology Workshop';

UPDATE events 
SET 
    venue_id = (SELECT id FROM establishments WHERE name = 'Adams Morgan Wellness Cafe' LIMIT 1),
    location_details = jsonb_build_object(
        'address', '2423 18th St NW',
        'city', 'Washington',
        'state', 'DC',
        'zip', '20009',
        'country', 'USA',
        'latitude', 38.9201,
        'longitude', -77.0420
    )
WHERE name = 'Mindful Monday Meetup';

-- Step 6: Clear and rebuild swig circuit venues with nearby establishments
DELETE FROM swig_circuit_venues WHERE swig_circuit_id IN (
    SELECT id FROM swig_circuits WHERE name IN ('Downtown Sober Circuit', 'Wellness Weekend Circuit', 'Artisan Mocktail Trail')
);

-- Link Downtown Sober Circuit with 3 venues
INSERT INTO swig_circuit_venues (id, swig_circuit_id, establishment_id, position)
SELECT 
    gen_random_uuid(),
    sc.id,
    e.id,
    ROW_NUMBER() OVER (ORDER BY e.name)
FROM swig_circuits sc
CROSS JOIN establishments e
WHERE sc.name = 'Downtown Sober Circuit' 
AND e.name IN ('Downtown Mocktail Bar', 'Capitol Hill Kombucha Bar', 'Dupont Circle Juice Bar');

-- Link Wellness Weekend Circuit with 2 venues
INSERT INTO swig_circuit_venues (id, swig_circuit_id, establishment_id, position)
SELECT 
    gen_random_uuid(),
    sc.id,
    e.id,
    ROW_NUMBER() OVER (ORDER BY e.name)
FROM swig_circuits sc
CROSS JOIN establishments e
WHERE sc.name = 'Wellness Weekend Circuit' 
AND e.name IN ('Dupont Circle Juice Bar', 'Adams Morgan Wellness Cafe');

-- Link Artisan Mocktail Trail with 2 venues
INSERT INTO swig_circuit_venues (id, swig_circuit_id, establishment_id, position)
SELECT 
    gen_random_uuid(),
    sc.id,
    e.id,
    ROW_NUMBER() OVER (ORDER BY e.name)
FROM swig_circuits sc
CROSS JOIN establishments e
WHERE sc.name = 'Artisan Mocktail Trail' 
AND e.name IN ('Georgetown Sober Lounge', 'Adams Morgan Wellness Cafe');
