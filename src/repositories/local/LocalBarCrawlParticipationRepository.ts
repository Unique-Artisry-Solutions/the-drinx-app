
import { BarCrawlParticipation, BarCrawlParticipationRepository } from '../models/BarCrawlParticipation';
import { isSampleBarCrawlId } from '@/utils/barCrawlUtils';

/**
 * Local storage implementation of the BarCrawlParticipationRepository 
 * Used for sample data and testing
 */
export class LocalBarCrawlParticipationRepository implements BarCrawlParticipationRepository {
  private STORAGE_KEY = 'user_bar_crawl_participations';
  
  /**
   * Get all participations from local storage
   */
  private getParticipations(): BarCrawlParticipation[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
  
  /**
   * Save participations to local storage
   */
  private saveParticipations(participations: BarCrawlParticipation[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(participations));
  }
  
  /**
   * Check if a user is participating in a bar crawl
   */
  async isUserParticipating(userId: string, barCrawlId: string): Promise<boolean> {
    if (!userId) return false;
    
    const participations = this.getParticipations();
    
    const isAlreadyJoined = participations.some(
      p => p.bar_crawl_id === barCrawlId && p.user_id === userId
    );
    
    return isAlreadyJoined;
  }
  
  /**
   * Add a user to a bar crawl
   */
  async joinBarCrawl(userId: string, barCrawlId: string): Promise<BarCrawlParticipation> {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const participations = this.getParticipations();
    
    // Check if already joined
    const existing = participations.find(
      p => p.bar_crawl_id === barCrawlId && p.user_id === userId
    );
    
    if (existing) {
      throw new Error('Already joined this bar crawl');
    }
    
    // Create new participation
    const newParticipation = {
      id: `participation-${Date.now()}`,
      user_id: userId,
      bar_crawl_id: barCrawlId,
      joined_at: new Date().toISOString()
    };
    
    // Save to local storage
    this.saveParticipations([...participations, newParticipation]);
    
    return newParticipation;
  }
  
  /**
   * Remove a user from a bar crawl
   */
  async leaveBarCrawl(userId: string, barCrawlId: string): Promise<boolean> {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const participations = this.getParticipations();
    
    const updatedParticipations = participations.filter(
      p => p.bar_crawl_id !== barCrawlId || p.user_id !== userId
    );
    
    // Save to local storage
    this.saveParticipations(updatedParticipations);
    
    return true;
  }
}
