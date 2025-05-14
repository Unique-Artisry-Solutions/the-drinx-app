
import { BaseEntity } from "../types";

/**
 * Model representing a user's participation in a bar crawl
 */
export interface BarCrawlParticipation extends BaseEntity {
  user_id: string;
  bar_crawl_id: string;
  joined_at: string;
}

/**
 * Repository interface specific to bar crawl participation
 */
export interface BarCrawlParticipationRepository {
  /**
   * Check if a user is participating in a bar crawl
   */
  isUserParticipating(userId: string, barCrawlId: string): Promise<boolean>;
  
  /**
   * Add a user to a bar crawl
   */
  joinBarCrawl(userId: string, barCrawlId: string): Promise<BarCrawlParticipation>;
  
  /**
   * Remove a user from a bar crawl
   */
  leaveBarCrawl(userId: string, barCrawlId: string): Promise<boolean>;
}
