-- Reset all establishment owners and assign only 3 core establishments
-- This ensures promoters see exactly 3 contactable venues for testing

-- First, reset ALL establishment owners to NULL
UPDATE establishments 
SET owner_id = NULL;

-- Then assign only the 3 core establishments to test users
-- The Mocktail Lounge -> testbar user
UPDATE establishments 
SET owner_id = '6531c6f1-9aa8-4f7e-9e5e-cf29b85455f6'
WHERE id = '9f5c8180-844b-4fab-8df1-47cf76be4b1c';

-- Sober Bar & Kitchen -> testestablishment user  
UPDATE establishments
SET owner_id = '3a077b83-d859-466a-affb-2f87f52c3a6e'
WHERE id = '107879b3-b65c-401b-ada9-dcaa4b62ff63';

-- Zero Proof -> testbar user
UPDATE establishments
SET owner_id = '6531c6f1-9aa8-4f7e-9e5e-cf29b85455f6'
WHERE id = '202aa105-9d24-4bfd-87de-b80608852ebd';