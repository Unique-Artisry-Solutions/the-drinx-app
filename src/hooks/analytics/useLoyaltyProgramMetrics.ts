
import { useState, useEffect } from 'react';

export interface LoyaltyProgramMetrics {
  memberCount: number;
  activeMembers: number;
  redemptionRate: number;
  averagePoints: number;
  memberRetentionRate: number;
  data: Array<{
    name: string;
    signups: number;
    redemptions: number;
    activeMembers: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

export function useLoyaltyProgramMetrics(establishmentId: string): LoyaltyProgramMetrics {
  const [metrics, setMetrics] = useState<LoyaltyProgramMetrics>({
    memberCount: 0,
    activeMembers: 0,
    redemptionRate: 0,
    averagePoints: 0,
    memberRetentionRate: 0,
    data: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // Mock data for now
    const mockFetch = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data with consistent pattern based on establishmentId
        const seed = establishmentId.charCodeAt(0) + establishmentId.charCodeAt(establishmentId.length - 1);
        const memberCount = 100 + (seed % 900);
        const activeMembers = Math.floor(memberCount * (0.6 + (seed % 30) / 100));
        const redemptionRate = 10 + (seed % 40);
        const averagePoints = 250 + (seed % 750);
        const memberRetentionRate = 60 + (seed % 30);
        
        // Generate consistent time-series data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = months.map((month, i) => {
          const baseFactor = ((seed + i) % 10) / 10;
          return {
            name: month,
            signups: Math.floor(20 + (baseFactor * 50)),
            redemptions: Math.floor(10 + (baseFactor * 30)),
            activeMembers: Math.floor(activeMembers * (0.8 + (baseFactor * 0.4)))
          };
        });
        
        setMetrics({
          memberCount,
          activeMembers,
          redemptionRate,
          averagePoints,
          memberRetentionRate,
          data,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setMetrics(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load loyalty program metrics'
        }));
      }
    };
    
    mockFetch();
  }, [establishmentId]);
  
  return metrics;
}
