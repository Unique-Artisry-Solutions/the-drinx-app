
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '../use-toast';
import { useRetry } from '../useRetry';
import { MessageThread } from './types';

// Cache to prevent concurrent thread creation for the same venue
const threadCreationCache = new Map<string, Promise<string | null>>();

export const useThreadCreation = () => {
  const { toast } = useToast();
  const { executeWithRetry } = useRetry();
  const [isCreating, setIsCreating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const createThread = async (venueId: string): Promise<string | null> => {
    // Create cache key for this venue and user combination
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to start a conversation.",
        variant: "destructive"
      });
      return null;
    }

    const cacheKey = `${user.data.user.id}-${venueId}`;
    
    // Check if there's already a thread creation in progress for this venue
    if (threadCreationCache.has(cacheKey)) {
      console.log('🧵 Thread creation already in progress, waiting for result...');
      return threadCreationCache.get(cacheKey)!;
    }

    // Create the thread creation promise
    const threadCreationPromise = createThreadInternal(venueId, user.data.user.id);
    
    // Cache the promise to prevent concurrent requests
    threadCreationCache.set(cacheKey, threadCreationPromise);
    
    try {
      const result = await threadCreationPromise;
      return result;
    } finally {
      // Clean up cache after completion (success or failure)
      threadCreationCache.delete(cacheKey);
    }
  };

  const createThreadInternal = async (venueId: string, userId: string): Promise<string | null> => {
    setIsCreating(true);
    
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
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

      console.log('🧵 Creating thread with user:', userId, 'venue:', venueId);

      // Use the new database function to safely get or create thread
      const { data: threadId, error } = await executeWithRetry(async () =>
        supabase.rpc('get_or_create_thread', {
          p_promoter_id: userId,
          p_venue_id: venueId
        })
      );

      if (error) {
        console.error('🧵 Thread creation error:', error);
        throw error;
      }

      if (!threadId) {
        throw new Error("Failed to create or retrieve thread");
      }

      console.log('🧵 Thread obtained successfully:', threadId);
      return threadId;
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
      } else if (err.name === 'AbortError') {
        // Don't show error for aborted requests
        console.log('🧵 Thread creation aborted');
        return null;
      }
      
      toast({
        title: "Error Creating Conversation",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCreating(false);
      abortControllerRef.current = null;
    }
  };

  return {
    createThread,
    isCreating
  };
};
