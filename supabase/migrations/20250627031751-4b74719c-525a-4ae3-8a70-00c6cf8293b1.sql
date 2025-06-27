
-- Phase 2: Data Validation & Cleanup
-- First, let's check for any orphaned records that would prevent foreign key creation

-- Check for promoter_venue_threads with invalid promoter_id references
DO $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphaned_count
    FROM promoter_venue_threads pvt
    LEFT JOIN profiles p ON pvt.promoter_id = p.id
    WHERE p.id IS NULL;
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Found % orphaned promoter_venue_threads records with invalid promoter_id', orphaned_count;
        -- Delete orphaned threads to allow foreign key creation
        DELETE FROM promoter_venue_threads
        WHERE promoter_id NOT IN (SELECT id FROM profiles WHERE id IS NOT NULL);
    END IF;
END $$;

-- Check for promoter_venue_threads with invalid venue_id references
DO $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphaned_count
    FROM promoter_venue_threads pvt
    LEFT JOIN establishments e ON pvt.venue_id = e.id
    WHERE e.id IS NULL;
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Found % orphaned promoter_venue_threads records with invalid venue_id', orphaned_count;
        -- Delete orphaned threads to allow foreign key creation
        DELETE FROM promoter_venue_threads
        WHERE venue_id NOT IN (SELECT id FROM establishments WHERE id IS NOT NULL);
    END IF;
END $$;

-- Check for promoter_venue_messages with invalid thread_id references
DO $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphaned_count
    FROM promoter_venue_messages pvm
    LEFT JOIN promoter_venue_threads pvt ON pvm.thread_id = pvt.id
    WHERE pvt.id IS NULL;
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Found % orphaned promoter_venue_messages records with invalid thread_id', orphaned_count;
        -- Delete orphaned messages to allow foreign key creation
        DELETE FROM promoter_venue_messages
        WHERE thread_id NOT IN (SELECT id FROM promoter_venue_threads WHERE id IS NOT NULL);
    END IF;
END $$;

-- Check for promoter_venue_messages with invalid sender_id references
DO $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphaned_count
    FROM promoter_venue_messages pvm
    LEFT JOIN profiles p ON pvm.sender_id = p.id
    WHERE p.id IS NULL;
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Found % orphaned promoter_venue_messages records with invalid sender_id', orphaned_count;
        -- Delete orphaned messages to allow foreign key creation
        DELETE FROM promoter_venue_messages
        WHERE sender_id NOT IN (SELECT id FROM profiles WHERE id IS NOT NULL);
    END IF;
END $$;

-- Check for message_read_status with invalid thread_id references
DO $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphaned_count
    FROM message_read_status mrs
    LEFT JOIN promoter_venue_threads pvt ON mrs.thread_id = pvt.id
    WHERE pvt.id IS NULL;
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Found % orphaned message_read_status records with invalid thread_id', orphaned_count;
        -- Delete orphaned read status records
        DELETE FROM message_read_status
        WHERE thread_id NOT IN (SELECT id FROM promoter_venue_threads WHERE id IS NOT NULL);
    END IF;
END $$;

-- Check for message_read_status with invalid user_id references
DO $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphaned_count
    FROM message_read_status mrs
    LEFT JOIN profiles p ON mrs.user_id = p.id
    WHERE p.id IS NULL;
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Found % orphaned message_read_status records with invalid user_id', orphaned_count;
        -- Delete orphaned read status records
        DELETE FROM message_read_status
        WHERE user_id NOT IN (SELECT id FROM profiles WHERE id IS NOT NULL);
    END IF;
END $$;

-- Phase 3: Create Foreign Key Constraints
-- Add foreign key constraints to promoter_venue_threads
ALTER TABLE public.promoter_venue_threads
ADD CONSTRAINT fk_promoter_venue_threads_promoter_id
FOREIGN KEY (promoter_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

ALTER TABLE public.promoter_venue_threads
ADD CONSTRAINT fk_promoter_venue_threads_venue_id
FOREIGN KEY (venue_id) REFERENCES public.establishments(id) 
ON DELETE CASCADE;

-- Add foreign key constraints to promoter_venue_messages
ALTER TABLE public.promoter_venue_messages
ADD CONSTRAINT fk_promoter_venue_messages_thread_id
FOREIGN KEY (thread_id) REFERENCES public.promoter_venue_threads(id) 
ON DELETE CASCADE;

ALTER TABLE public.promoter_venue_messages
ADD CONSTRAINT fk_promoter_venue_messages_sender_id
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Add foreign key constraints to message_read_status
ALTER TABLE public.message_read_status
ADD CONSTRAINT fk_message_read_status_thread_id
FOREIGN KEY (thread_id) REFERENCES public.promoter_venue_threads(id) 
ON DELETE CASCADE;

ALTER TABLE public.message_read_status
ADD CONSTRAINT fk_message_read_status_user_id
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_promoter_venue_threads_promoter_id 
ON public.promoter_venue_threads(promoter_id);

CREATE INDEX IF NOT EXISTS idx_promoter_venue_threads_venue_id 
ON public.promoter_venue_threads(venue_id);

CREATE INDEX IF NOT EXISTS idx_promoter_venue_messages_thread_id 
ON public.promoter_venue_messages(thread_id);

CREATE INDEX IF NOT EXISTS idx_promoter_venue_messages_sender_id 
ON public.promoter_venue_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_message_read_status_thread_id 
ON public.message_read_status(thread_id);

CREATE INDEX IF NOT EXISTS idx_message_read_status_user_id 
ON public.message_read_status(user_id);

-- Verify the constraints were created successfully
DO $$
BEGIN
    RAISE NOTICE 'Foreign key constraints have been successfully created for the messaging system tables.';
    RAISE NOTICE 'This will improve TypeScript type inference and prevent orphaned records.';
END $$;
