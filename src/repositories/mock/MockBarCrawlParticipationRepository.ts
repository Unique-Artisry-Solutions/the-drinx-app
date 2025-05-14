
import { BarCrawlParticipation, BarCrawlParticipationRepository } from '../models/BarCrawlParticipation';

/**
 * Mock implementation of the BarCrawlParticipationRepository for testing
 */
export class MockBarCrawlParticipationRepository implements BarCrawlParticipationRepository {
  private participations: BarCrawlParticipation[] = [];
  private shouldThrowError = false;
  
  /**
   * Set the mock to throw errors for testing error states
   */
  setThrowError(shouldThrow: boolean): void {
    this.shouldThrowError = shouldThrow;
  }
  
  /**
   * Set initial participations for testing
   */
  setParticipations(participations: BarCrawlParticipation[]): void {
    this.participations = [...participations];
  }
  
  /**
   * Get all participations
   */
  getParticipations(): BarCrawlParticipation[] {
    return [...this.participations];
  }
  
  /**
   * Check if a user is participating in a bar crawl
   */
  async isUserParticipating(userId: string, barCrawlId: string): Promise<boolean> {
    if (this.shouldThrowError) {
      throw new Error('Failed to check participation: Mock error');
    }
    
    if (!userId) return false;
    
    return this.participations.some(
      p => p.bar_crawl_id === barCrawlId && p.user_id === userId
    );
  }
  
  /**
   * Add a user to a bar crawl
   */
  async joinBarCrawl(userId: string, barCrawlId: string): Promise<BarCrawlParticipation> {
    if (this.shouldThrowError) {
      throw new Error('Failed to join bar crawl: Mock error');
    }
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Check if already joined
    const existing = this.participations.find(
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
    
    this.participations.push(newParticipation);
    
    return newParticipation;
  }
  
  /**
   * Remove a user from a bar crawl
   */
  async leaveBarCrawl(userId: string, barCrawlId: string): Promise<boolean> {
    if (this.shouldThrowError) {
      throw new Error('Failed to leave bar crawl: Mock error');
    }
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    this.participations = this.participations.filter(
      p => p.bar_crawl_id !== barCrawlId || p.user_id !== userId
    );
    
    return true;
  }
}
