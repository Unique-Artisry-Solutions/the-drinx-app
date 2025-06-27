
import { RewardTransaction } from '@/types/rewards/api';

export interface CheckInOptions {
  userId?: string;
  rating?: number;
  note?: string;
  establishmentName?: string;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  points?: number;
  transaction?: RewardTransaction;
}

export interface SwigCircuitCheckIn {
  type: 'swig_circuit';
  entityId: string;
  entityName: string;
  establishmentId: string;
  establishmentName: string;
}

export interface EstablishmentCheckIn {
  type: 'establishment';
  entityId: string;
  entityName: string;
  locationData?: {
    latitude: number;
    longitude: number;
  };
}

export interface BarCrawlCheckIn {
  type: 'bar_crawl';
  entityId: string;
  entityName: string;
  additionalData?: {
    establishment_id: string;
    establishment_name: string;
  };
}

export type CheckInContext = SwigCircuitCheckIn | EstablishmentCheckIn | BarCrawlCheckIn;

export interface UserVisitStats {
  total_visits: number;
  unique_establishments: number;
  total_points_earned: number;
  visited_entities: Array<{
    entity_id: string;
    entity_name: string;
    visit_count: number;
    last_visit: string;
  }>;
}

class CheckInService {
  async performCheckIn(
    userId: string, 
    context: EstablishmentCheckIn | BarCrawlCheckIn | SwigCircuitCheckIn,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      console.log('Performing check-in:', { userId, context, options });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Only access locationData when context is EstablishmentCheckIn
      let locationInfo = '';
      if (context.type === 'establishment' && context.locationData) {
        locationInfo = ` at coordinates ${context.locationData.latitude}, ${context.locationData.longitude}`;
      }
      
      // Generate success message based on context type using proper type narrowing
      let message: string;
      if (context.type === 'establishment') {
        message = `Successfully checked in to ${context.entityName}${locationInfo}!`;
      } else if (context.type === 'bar_crawl') {
        message = `Successfully checked in to ${context.entityName}!`;
      } else if (context.type === 'swig_circuit') {
        message = `Successfully checked in to ${context.entityName} at ${context.establishmentName}!`;
      } else {
        message = `Successfully checked in to ${context.entityName}!`;
      }
      
      return {
        success: true,
        message,
        points: 10
      };
    } catch (error) {
      console.error('Check-in failed:', error);
      return {
        success: false,
        message: 'Check-in failed. Please try again.'
      };
    }
  }

  async getCheckInHistory(
    userId: string,
    options: { type?: string; limit?: number; offset?: number } = {}
  ): Promise<RewardTransaction[]> {
    // Mock implementation
    return [];
  }

  async getVisitStats(userId: string): Promise<UserVisitStats> {
    // Mock implementation
    return {
      total_visits: 0,
      unique_establishments: 0,
      total_points_earned: 0,
      visited_entities: []
    };
  }
}

export const checkInService = new CheckInService();
