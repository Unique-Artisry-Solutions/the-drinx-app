
import { useCallback } from 'react';
import { trackEvent, AnalyticsEvent } from '@/utils/analytics';
import { useToast } from '@/hooks/use-toast';

export function useAnalytics() {
  const { toast } = useToast();
  
  const track = useCallback(async (eventType: string, eventData?: Record<string, any>) => {
    try {
      const event: AnalyticsEvent = {
        eventType,
        eventData,
        pageUrl: window.location.pathname
      };
      
      const result = await trackEvent(event);
      return !!result;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return false;
    }
  }, []);
  
  const trackWithFeedback = useCallback(async (eventType: string, eventData?: Record<string, any>, showSuccess = false) => {
    try {
      const success = await track(eventType, eventData);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Analytics Error",
          description: "Unable to track event data."
        });
        return false;
      }
      
      if (showSuccess) {
        toast({
          title: "Analytics Tracked",
          description: "Event data successfully recorded."
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error in trackWithFeedback:', error);
      return false;
    }
  }, [track, toast]);
  
  const trackPage = useCallback((pageName: string) => {
    return track('page_view', { page: pageName });
  }, [track]);
  
  const trackAction = useCallback((action: string, details?: Record<string, any>) => {
    return track('user_action', { action, ...details });
  }, [track]);
  
  const trackError = useCallback((errorType: string, errorDetails: Record<string, any>) => {
    return track('error', { error_type: errorType, ...errorDetails });
  }, [track]);
  
  // Add service fee tracking
  const trackServiceFee = useCallback((feeAmount: number, percentage: number, transactionTotal: number) => {
    return track('service_fee_collected', { 
      fee_amount: feeAmount,
      fee_percentage: percentage,
      transaction_total: transactionTotal,
      timestamp: new Date().toISOString()
    });
  }, [track]);
  
  return {
    track,
    trackWithFeedback,
    trackPage,
    trackAction,
    trackError,
    trackServiceFee
  };
}
