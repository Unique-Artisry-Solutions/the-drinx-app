
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChurnRiskScore {
  id: string;
  follower_id: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: Record<string, any>;
  prediction_confidence: number;
  last_activity_days: number;
  engagement_decline_rate: number;
  intervention_suggested: string;
  calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChurnAnalytics {
  totalAtRisk: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  averageRiskScore: number;
  recommendedInterventions: string[];
}

export const useChurnAnalytics = (promoterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get churn risk scores - using mock data since table doesn't exist yet
  const { data: churnScores = [], isLoading } = useQuery({
    queryKey: ['churn-risk-scores', promoterId],
    queryFn: async () => {
      // Return mock churn risk data for now
      const mockChurnScores: ChurnRiskScore[] = [
        {
          id: '1',
          follower_id: 'follower-1',
          risk_score: 75,
          risk_level: 'high',
          risk_factors: { inactivity_days: 14, engagement_decline: 0.4 },
          prediction_confidence: 85,
          last_activity_days: 14,
          engagement_decline_rate: 0.4,
          intervention_suggested: 'Send personalized re-engagement email',
          calculated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          follower_id: 'follower-2',
          risk_score: 45,
          risk_level: 'medium',
          risk_factors: { inactivity_days: 7, engagement_decline: 0.2 },
          prediction_confidence: 70,
          last_activity_days: 7,
          engagement_decline_rate: 0.2,
          intervention_suggested: 'Offer exclusive content',
          calculated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return mockChurnScores;
    },
    enabled: !!promoterId
  });

  // Calculate analytics from churn scores
  const analytics: ChurnAnalytics = {
    totalAtRisk: churnScores.filter(score => score.risk_level !== 'low').length,
    riskDistribution: {
      low: churnScores.filter(score => score.risk_level === 'low').length,
      medium: churnScores.filter(score => score.risk_level === 'medium').length,
      high: churnScores.filter(score => score.risk_level === 'high').length,
      critical: churnScores.filter(score => score.risk_level === 'critical').length,
    },
    averageRiskScore: churnScores.length > 0 
      ? churnScores.reduce((sum, score) => sum + score.risk_score, 0) / churnScores.length 
      : 0,
    recommendedInterventions: [
      ...new Set(
        churnScores
          .filter(score => score.risk_level !== 'low')
          .map(score => score.intervention_suggested)
      )
    ]
  };

  // Update churn risk scores - simplified mock implementation
  const updateChurnScores = useMutation({
    mutationFn: async () => {
      // Mock implementation - in reality this would call a database function
      console.log('Updating churn risk scores for promoter:', promoterId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churn-risk-scores'] });
      toast({
        title: "Churn Analysis Updated",
        description: "Risk scores have been recalculated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating churn scores:', error);
      toast({
        title: "Error",
        description: "Failed to update churn analysis. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    churnScores,
    analytics,
    isLoading,
    updateChurnScores
  };
};
