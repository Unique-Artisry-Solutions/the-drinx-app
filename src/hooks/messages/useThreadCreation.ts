
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
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error("User not authenticated");
      }

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

      if (error) throw error;
      return data.id;
    } catch (err: any) {
      console.error('Error creating thread:', err);
      toast({
        title: "Error Creating Conversation",
        description: "Failed to create conversation. Please try again.",
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
