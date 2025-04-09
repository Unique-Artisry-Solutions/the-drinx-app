
import { useState, useEffect } from 'react';

export interface ContentMetrics {
  totalContent: number;
  publishedContent: number;
  engagementRate: number;
  topContentTypes: Array<{ name: string; value: number }>;
  timeSeriesData: Array<{
    name: string;
    reviews: number;
    photos: number;
    comments: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

export function useContentAnalytics(establishmentId: string): ContentMetrics {
  const [metrics, setMetrics] = useState<ContentMetrics>({
    totalContent: 0,
    publishedContent: 0,
    engagementRate: 0,
    topContentTypes: [],
    timeSeriesData: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    const mockFetch = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock data with consistent pattern based on establishmentId
        const seed = establishmentId.charCodeAt(0) + establishmentId.charCodeAt(establishmentId.length - 1);
        const totalContent = 200 + (seed % 800);
        const publishedContent = Math.floor(totalContent * (0.7 + (seed % 20) / 100));
        const engagementRate = 5 + (seed % 15);
        
        // Top content types
        const topContentTypes = [
          { name: 'Reviews', value: Math.floor(totalContent * 0.5) },
          { name: 'Photos', value: Math.floor(totalContent * 0.3) },
          { name: 'Comments', value: Math.floor(totalContent * 0.2) }
        ];
        
        // Generate consistent time-series data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const timeSeriesData = months.map((month, i) => {
          const baseFactor = ((seed + i) % 10) / 10;
          return {
            name: month,
            reviews: Math.floor(30 + (baseFactor * 70)),
            photos: Math.floor(15 + (baseFactor * 45)),
            comments: Math.floor(10 + (baseFactor * 30))
          };
        });
        
        setMetrics({
          totalContent,
          publishedContent,
          engagementRate,
          topContentTypes,
          timeSeriesData,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setMetrics(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load content analytics'
        }));
      }
    };
    
    mockFetch();
  }, [establishmentId]);
  
  return metrics;
}
