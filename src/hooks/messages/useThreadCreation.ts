
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '../use-toast';
import { useRetry } from '../useRetry';
import { MessageThread } from './types';

export const useThreadCreation = () => {
  const { toast } = useToast();
  const { executeWithRetry } = useRetry();
  const [isCreating, setIsCreating] = useState(false);

  const createThread = async (venueId: string): Promise<string | null> => {
    setIsCreating(true);
    
    console.log('🧵 Creating thread for venue:', venueId);
    
    try {
      // Validate venue ID format
      if (!venueId || typeof venueId !== 'string' || venueId.trim() === '') {
        throw new Error("Invalid venue ID provided");
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(venueId)) {
        throw new Error("Venue ID must be a valid UUID");
      }

      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error("User not authenticated");
      }

      console.log('🧵 Creating thread with user:', user.data.user.id, 'venue:', venueId);

      // Check if thread already exists
      const { data: existingThread } = await supabase
        .from('promoter_venue_threads')
        .select('id')
        .eq('venue_id', venueId)
        .eq('promoter_id', user.data.user.id)
        .eq('is_archived', false)
        .maybeSingle();

      if (existingThread) {
        console.log('🧵 Thread already exists:', existingThread.id);
        return existingThread.id;
      }

      // Create new thread with retry logic
      const { data, error } = await executeWithRetry(async () =>
        supabase
          .from('promoter_venue_threads')
          .insert({
            venue_id: venueId,
            promoter_id: user.data.user.id,
            is_archived: false
          })
          .select()
          .single()
      );

      if (error) {
        console.error('🧵 Thread creation error:', error);
        throw error;
      }

      console.log('🧵 Thread created successfully:', data.id);
      return data.id;
    } catch (err: any) {
      console.error('🧵 Error creating thread:', err);
      
      let errorMessage = "Failed to create conversation. Please try again.";
      
      // Provide more specific error messages
      if (err.message?.includes('Invalid venue ID') || err.message?.includes('UUID')) {
        errorMessage = "Invalid venue selected. Please try selecting a different venue.";
      } else if (err.message?.includes('not authenticated')) {
        errorMessage = "You must be logged in to start a conversation.";
      } else if (err.code === 'PGRST116') {
        errorMessage = "Venue not found. Please try selecting a different venue.";
      } else if (err.code?.startsWith('23')) {
        errorMessage = "Database constraint error. Please contact support.";
      }
      
      toast({
        title: "Error Creating Conversation",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createThread,
    isCreating
  };
};
