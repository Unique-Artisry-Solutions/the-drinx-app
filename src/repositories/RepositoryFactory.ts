import { RepositoryFactory } from './types';
import { SupabaseBarCrawlParticipationRepository } from './supabase/SupabaseBarCrawlParticipationRepository';
import { LocalBarCrawlParticipationRepository } from './local/LocalBarCrawlParticipationRepository';
import { MockBarCrawlParticipationRepository } from './mock/MockBarCrawlParticipationRepository';
import { BarCrawlParticipationRepository } from './models/BarCrawlParticipation';

export enum RepositoryType {
  SUPABASE = 'supabase',
  LOCAL = 'local',
  MOCK = 'mock'
}

/**
 * Factory for creating repositories
 * Allows switching between different data sources
 */
export class BarCrawlRepositoryFactory {
  private static repositoryType: RepositoryType = RepositoryType.SUPABASE;
  private static mockRepositories: Record<string, any> = {};
  
  /**
   * Set the repository type to use
   */
  static setRepositoryType(type: RepositoryType): void {
    this.repositoryType = type;
  }
  
  /**
   * Get the current repository type
   */
  static getRepositoryType(): RepositoryType {
    return this.repositoryType;
  }
  
  /**
   * Set a mock repository instance for testing
   */
  static setMockRepository(name: string, instance: any): void {
    this.mockRepositories[name] = instance;
  }
  
  /**
   * Get a repository by name
   */
  static getBarCrawlParticipationRepository(): BarCrawlParticipationRepository {
    // For testing, return mock instance if it exists
    if (this.repositoryType === RepositoryType.MOCK && this.mockRepositories['barCrawlParticipation']) {
      return this.mockRepositories['barCrawlParticipation'];
    }
    
    // Otherwise create appropriate repository based on type
    switch (this.repositoryType) {
      case RepositoryType.LOCAL:
        return new LocalBarCrawlParticipationRepository();
      case RepositoryType.MOCK:
        return new MockBarCrawlParticipationRepository();
      case RepositoryType.SUPABASE:
      default:
        return new SupabaseBarCrawlParticipationRepository();
    }
  }
  
  /**
   * Auto-detect the best repository type based on environment
   */
  static autoDetectRepositoryType(): void {
    // Use local storage for sample data in dev/preview environments
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    
    if (isAdminBypass || window.location.hostname === 'localhost') {
      this.setRepositoryType(RepositoryType.LOCAL);
    } else {
      this.setRepositoryType(RepositoryType.SUPABASE);
    }
  }
}
