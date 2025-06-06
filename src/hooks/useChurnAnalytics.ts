
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

  // Get churn risk scores for promoter's followers
  const { data: churnScores = [], isLoading } = useQuery({
    queryKey: ['churn-risk-scores', promoterId],
    queryFn: async () => {
      // First get follower IDs for this promoter
      const { data: followers, error: followersError } = await supabase
        .from('promoter_followers')
        .select('id')
        .eq('promoter_id', promoterId);

      if (followersError) throw followersError;

      if (!followers || followers.length === 0) {
        return [];
      }

      const followerIds = followers.map(f => f.id);

      // Then get churn scores for those followers
      const { data, error } = await supabase
        .from('churn_risk_scores')
        .select('*')
        .in('follower_id', followerIds)
        .order('risk_score', { ascending: false });

      if (error) throw error;
      return data as ChurnRiskScore[];
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

  // Update churn risk scores
  const updateChurnScores = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('update_churn_risk_scores');
      if (error) throw error;
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
