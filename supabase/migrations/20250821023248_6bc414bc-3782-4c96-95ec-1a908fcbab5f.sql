-- Create message threads between DevBypass test users for testing
-- Connect test promoter (testpromoter) with test establishments (testbar's venues)

-- Create thread between promoter and The Mocktail Lounge
INSERT INTO promoter_venue_threads (
  id,
  promoter_id,
  venue_id,
  subject,
  is_archived,
  last_message_at,
  created_at
) VALUES (
  gen_random_uuid(),
  '1693e1ac-572d-4b36-aeb3-15f121ce2888', -- testpromoter
  '9f5c8180-844b-4fab-8df1-47cf76be4b1c', -- The Mocktail Lounge
  'Event Collaboration Discussion',
  false,
  now() - interval '2 hours',
  now() - interval '3 days'
);

-- Create thread between promoter and Zero Proof
INSERT INTO promoter_venue_threads (
  id,
  promoter_id,
  venue_id,
  subject,
  is_archived,
  last_message_at,
  created_at
) VALUES (
  gen_random_uuid(),
  '1693e1ac-572d-4b36-aeb3-15f121ce2888', -- testpromoter
  '202aa105-9d24-4bfd-87de-b80608852ebd', -- Zero Proof
  'Partnership Opportunity',
  false,
  now() - interval '1 hour',
  now() - interval '2 days'
);

-- Add initial messages to make threads visible and testable
-- Get the thread IDs we just created
WITH mocktail_thread AS (
  SELECT id FROM promoter_venue_threads 
  WHERE promoter_id = '1693e1ac-572d-4b36-aeb3-15f121ce2888' 
  AND venue_id = '9f5c8180-844b-4fab-8df1-47cf76be4b1c'
),
zero_proof_thread AS (
  SELECT id FROM promoter_venue_threads 
  WHERE promoter_id = '1693e1ac-572d-4b36-aeb3-15f121ce2888' 
  AND venue_id = '202aa105-9d24-4bfd-87de-b80608852ebd'
)

-- Insert messages for The Mocktail Lounge thread
INSERT INTO promoter_venue_messages (
  id,
  thread_id,
  sender_id,
  content,
  is_from_promoter,
  sent_at
)
SELECT 
  gen_random_uuid(),
  mocktail_thread.id,
  '1693e1ac-572d-4b36-aeb3-15f121ce2888', -- testpromoter as sender
  'Hi! I''m interested in hosting an event at The Mocktail Lounge. Do you have availability next month?',
  true,
  now() - interval '3 days'
FROM mocktail_thread

UNION ALL

SELECT 
  gen_random_uuid(),
  mocktail_thread.id,
  '6531c6f1-9aa8-4f7e-9e5e-cf29b85455f6', -- testbar as sender
  'Hello! Thanks for reaching out. We''d love to discuss this opportunity. What type of event are you planning?',
  false,
  now() - interval '2 hours'
FROM mocktail_thread;

-- Insert messages for Zero Proof thread
WITH zero_proof_thread AS (
  SELECT id FROM promoter_venue_threads 
  WHERE promoter_id = '1693e1ac-572d-4b36-aeb3-15f121ce2888' 
  AND venue_id = '202aa105-9d24-4bfd-87de-b80608852ebd'
)
INSERT INTO promoter_venue_messages (
  id,
  thread_id,
  sender_id,
  content,
  is_from_promoter,
  sent_at
)
SELECT 
  gen_random_uuid(),
  zero_proof_thread.id,
  '1693e1ac-572d-4b36-aeb3-15f121ce2888', -- testpromoter as sender
  'I''d like to explore a partnership opportunity with Zero Proof for upcoming events.',
  true,
  now() - interval '2 days'
FROM zero_proof_thread

UNION ALL

SELECT 
  gen_random_uuid(),
  zero_proof_thread.id,
  '6531c6f1-9aa8-4f7e-9e5e-cf29b85455f6', -- testbar as sender
  'That sounds great! We''re always interested in collaborating with promoters. Let''s schedule a call.',
  false,
  now() - interval '1 hour'
FROM zero_proof_thread;