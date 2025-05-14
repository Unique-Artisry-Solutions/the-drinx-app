
import { supabase } from '@/lib/supabase';
import { BarCrawlParticipation, BarCrawlParticipationRepository } from '../models/BarCrawlParticipation';
import { isValidUUID } from '@/utils/barCrawlUtils';

/**
 * Supabase implementation of the BarCrawlParticipationRepository
 */
export class SupabaseBarCrawlParticipationRepository implements BarCrawlParticipationRepository {
  /**
   * Check if a user is participating in a bar crawl
   */
  async isUserParticipating(userId: string, barCrawlId: string): Promise<boolean> {
    if (!userId) return false;
    
    if (!isValidUUID(barCrawlId)) {
      console.error('Invalid bar crawl ID format:', barCrawlId);
      throw new Error('Invalid bar crawl ID format');
    }
    
    const { data, error } = await supabase
      .from('user_bar_crawl_participation')
      .select('id')
      .eq('bar_crawl_id', barCrawlId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking participation:', error);
      throw new Error(`Failed to check participation: ${error.message}`);
    }
    
    return !!data;
  }
  
  /**
   * Add a user to a bar crawl
   */
  async joinBarCrawl(userId: string, barCrawlId: string): Promise<BarCrawlParticipation> {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!isValidUUID(barCrawlId)) {
      throw new Error('Invalid bar crawl ID format');
    }
    
    const { data, error } = await supabase
      .from('user_bar_crawl_participation')
      .insert({
        user_id: userId,
        bar_crawl_id: barCrawlId
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error joining bar crawl:', error);
      throw new Error(`Failed to join bar crawl: ${error.message}`);
    }
    
    return data as BarCrawlParticipation;
  }
  
  /**
   * Remove a user from a bar crawl
   */
  async leaveBarCrawl(userId: string, barCrawlId: string): Promise<boolean> {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!isValidUUID(barCrawlId)) {
      throw new Error('Invalid bar crawl ID format');
    }
    
    const { error } = await supabase
      .from('user_bar_crawl_participation')
      .delete()
      .eq('bar_crawl_id', barCrawlId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error leaving bar crawl:', error);
      throw new Error(`Failed to leave bar crawl: ${error.message}`);
    }
    
    return true;
  }
}
