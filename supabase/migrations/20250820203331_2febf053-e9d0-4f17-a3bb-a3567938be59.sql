-- Fix notification recipient logic to send to venue owners instead of venue IDs
CREATE OR REPLACE FUNCTION public.generate_notification_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  recipient_user_type TEXT;
  venue_owner_id UUID;
BEGIN
    -- Determine recipient type based on whether message is from promoter or venue
    IF NEW.is_from_promoter THEN
      -- Message is from promoter, so recipient is the venue owner (establishment user)
      recipient_user_type := 'establishment';
      
      -- Get the venue owner's user ID from the establishments table
      SELECT e.owner_id INTO venue_owner_id
      FROM promoter_venue_threads t
      JOIN establishments e ON e.id = t.venue_id
      WHERE t.id = NEW.thread_id;
      
      -- Only create notification if we found a valid venue owner
      IF venue_owner_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            recipient_id,
            recipient_type,
            title,
            content,
            priority,
            category_id,
            metadata
        )
        SELECT
            venue_owner_id,  -- Use venue owner's user ID instead of venue ID
            recipient_user_type,
            'New Message from Promoter',
            'You have received a new message from a promoter',
            'medium',
            (SELECT id FROM notification_categories WHERE name = 'promoter_message'),
            jsonb_build_object(
                'thread_id', NEW.thread_id,
                'message_id', NEW.id,
                'promoter_id', t.promoter_id,
                'venue_id', t.venue_id
            )
        FROM promoter_venue_threads t
        WHERE t.id = NEW.thread_id;
      END IF;
    ELSE
      -- Already handled by generate_notification_on_venue_response function
      RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$function$;