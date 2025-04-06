
import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useToast } from './use-toast';

export function useBarCrawlCheckIns() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Record a new check-in
  const recordCheckIn = async ({
    barCrawlId,
    establishmentId,
    userId,
    verifiedBy
  }: {
    barCrawlId: string;
    establishmentId: string;
    userId: string;
    verifiedBy?: string;
  }) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabaseClient
        .from('bar_crawl_check_ins')
        .insert({
          bar_crawl_id: barCrawlId,
          establishment_id: establishmentId,
          user_id: userId,
          verified_by: verifiedBy
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Check-in successful',
        description: 'You have been checked in to this establishment'
      });

      return data;
    } catch (error: any) {
      console.error('Error recording check-in:', error);
      
      toast({
        title: 'Check-in failed',
        description: error.message || 'Failed to record check-in',
        variant: 'destructive'
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get check-ins for a user in a specific bar crawl
  const getUserCheckIns = async (userId: string, barCrawlId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabaseClient
        .from('bar_crawl_check_ins')
        .select(`
          id,
          bar_crawl_id,
          establishment_id,
          checked_in_at,
          establishments (
            id,
            name,
            address,
            image_url
          )
        `)
        .eq('user_id', userId)
        .eq('bar_crawl_id', barCrawlId)
        .order('checked_in_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user check-ins:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get check-ins for an establishment in a specific bar crawl
  const getEstablishmentCheckIns = async (establishmentId: string, barCrawlId?: string) => {
    try {
      setIsLoading(true);
      
      let query = supabaseClient
        .from('bar_crawl_check_ins')
        .select(`
          id,
          bar_crawl_id,
          user_id,
          checked_in_at,
          profiles (
            id,
            username,
            display_name
          )
        `)
        .eq('establishment_id', establishmentId)
        .order('checked_in_at', { ascending: false });
      
      // Filter by bar crawl if provided
      if (barCrawlId) {
        query = query.eq('bar_crawl_id', barCrawlId);
      }
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching establishment check-ins:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    recordCheckIn,
    getUserCheckIns,
    getEstablishmentCheckIns
  };
}
