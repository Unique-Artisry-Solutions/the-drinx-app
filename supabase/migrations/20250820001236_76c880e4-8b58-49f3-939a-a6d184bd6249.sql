-- Task 1: Database Real-time Configuration

-- Enable real-time for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add notifications table to realtime publication if not already added
-- First check if it exists in the publication
DO $$
BEGIN
    -- Add table to supabase_realtime publication
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION 
    WHEN duplicate_table THEN 
        NULL; -- Table already in publication, ignore
END $$;

-- Enable real-time for notification_delivery_status table
ALTER TABLE public.notification_delivery_status REPLICA IDENTITY FULL;

-- Add notification_delivery_status to realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_delivery_status;
EXCEPTION 
    WHEN duplicate_table THEN 
        NULL; -- Table already in publication, ignore
END $$;

-- Enable real-time for sms_delivery_logs table
ALTER TABLE public.sms_delivery_logs REPLICA IDENTITY FULL;

-- Add sms_delivery_logs to realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sms_delivery_logs;
EXCEPTION 
    WHEN duplicate_table THEN 
        NULL; -- Table already in publication, ignore
END $$;