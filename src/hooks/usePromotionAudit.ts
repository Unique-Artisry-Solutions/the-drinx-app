
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getPromotionAuditLogs, 
  getPromotionUsageAnalytics, 
  PromotionAuditLog,
  PromotionUsageAnalytics
} from '@/lib/promotions/auditApi';

export interface UsePromotionAuditOptions {
  limit?: number;
  actionTypes?: string[];
}

export const usePromotionAudit = (promotionId: string, options: UsePromotionAuditOptions = {}) => {
  const [auditLogs, setAuditLogs] = useState<PromotionAuditLog[]>([]);
  const [analytics, setAnalytics] = useState<PromotionUsageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch both audit logs and analytics in parallel
      const [logsData, analyticsData] = await Promise.all([
        getPromotionAuditLogs(promotionId, options),
        getPromotionUsageAnalytics(promotionId)
      ]);
      
      setAuditLogs(logsData);
      setAnalytics(analyticsData);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load promotion audit data';
      setError(new Error(errorMsg));
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (promotionId) {
      fetchData();
    }
  }, [promotionId, options.limit, options.actionTypes?.join(',')]);
  
  return {
    auditLogs,
    analytics,
    isLoading,
    error,
    refetchLogs: fetchData
  };
};
