
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getPromotionAuditLogs, 
  getPromotionUsageAnalytics, 
  PromotionAuditLog,
  PromotionUsageAnalytics
} from '@/lib/promotions/auditApi';

export const usePromotionAudit = (promotionId: string) => {
  const [auditLogs, setAuditLogs] = useState<PromotionAuditLog[]>([]);
  const [analytics, setAnalytics] = useState<PromotionUsageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both audit logs and analytics in parallel
        const [logsData, analyticsData] = await Promise.all([
          getPromotionAuditLogs(promotionId),
          getPromotionUsageAnalytics(promotionId)
        ]);
        
        setAuditLogs(logsData);
        setAnalytics(analyticsData);
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
    
    if (promotionId) {
      fetchData();
    }
  }, [promotionId, toast]);
  
  return {
    auditLogs,
    analytics,
    isLoading,
    error
  };
};
