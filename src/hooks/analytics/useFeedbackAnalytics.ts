
import { useState, useEffect } from 'react';

export interface FeedbackMetrics {
  averageSentiment: number;
  totalFeedback: number;
  responseRate: number;
  averageResponseTime: number;
  sentimentDistribution: Array<{ name: string; value: number }>;
  sentimentTrend: Array<{
    name: string;
    positive: number;
    neutral: number;
    negative: number;
    responseRate: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

export function useFeedbackAnalytics(establishmentId: string): FeedbackMetrics {
  const [metrics, setMetrics] = useState<FeedbackMetrics>({
    averageSentiment: 0,
    totalFeedback: 0,
    responseRate: 0,
    averageResponseTime: 0,
    sentimentDistribution: [],
    sentimentTrend: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    const mockFetch = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Mock data with consistent pattern based on establishmentId
        const seed = establishmentId.charCodeAt(0) + establishmentId.charCodeAt(establishmentId.length - 1);
        const averageSentiment = 3.5 + ((seed % 30) / 10);
        const totalFeedback = 150 + (seed % 850);
        const responseRate = 60 + (seed % 30);
        const averageResponseTime = 12 + (seed % 24);
        
        // Sentiment distribution
        const positivePercent = 60 + (seed % 25);
        const negativePercent = 10 + (seed % 10);
        const neutralPercent = 100 - positivePercent - negativePercent;
        
        const sentimentDistribution = [
          { name: 'Positive', value: Math.round(totalFeedback * (positivePercent / 100)) },
          { name: 'Neutral', value: Math.round(totalFeedback * (neutralPercent / 100)) },
          { name: 'Negative', value: Math.round(totalFeedback * (negativePercent / 100)) }
        ];
        
        // Generate consistent time-series data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const sentimentTrend = months.map((month, i) => {
          const baseFactor = ((seed + i) % 10) / 10;
          const positiveRatio = (positivePercent / 100) + (baseFactor * 0.2 - 0.1);
          const negativeRatio = (negativePercent / 100) + (baseFactor * 0.1 - 0.05);
          const neutralRatio = 1 - positiveRatio - negativeRatio;
          
          const monthTotal = Math.floor((totalFeedback / 6) * (0.8 + baseFactor * 0.4));
          return {
            name: month,
            positive: Math.round(monthTotal * positiveRatio),
            neutral: Math.round(monthTotal * neutralRatio),
            negative: Math.round(monthTotal * negativeRatio),
            responseRate: Math.round(responseRate + (baseFactor * 20 - 10))
          };
        });
        
        setMetrics({
          averageSentiment,
          totalFeedback,
          responseRate,
          averageResponseTime,
          sentimentDistribution,
          sentimentTrend,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setMetrics(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load feedback analytics'
        }));
      }
    };
    
    mockFetch();
  }, [establishmentId]);
  
  return metrics;
}
