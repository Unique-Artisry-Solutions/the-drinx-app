
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as eventAnalyticsService from '@/services/eventAnalyticsService';

interface DateRange {
  startDate: string;
  endDate: string;
}

export const useEventAnalytics = (eventId: string, initialDateRange?: DateRange) => {
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange || {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [eventAnalytics, setEventAnalytics] = useState({
    views: 0,
    uniqueVisitors: 0,
    ticketSales: 0,
    revenue: 0,
    conversionRate: 0
  });
  
  const [dailyMetrics, setDailyMetrics] = useState({
    dates: [] as string[],
    views: [] as number[],
    ticketSales: [] as number[],
    revenue: [] as number[]
  });
  
  const [referralSources, setReferralSources] = useState<Array<{
    source: string;
    count: number;
    percentage: number;
  }>>([]);
  
  const [ticketSalesAnalytics, setTicketSalesAnalytics] = useState({
    totalTickets: 0,
    soldTickets: 0,
    attendanceRate: 0,
    salesByType: [] as Array<{
      typeName: string;
      sold: number;
      total: number;
      percentage: number;
    }>,
    recentSales: [] as Array<{
      date: string;
      quantity: number;
      revenue: number;
    }>
  });
  
  const { toast } = useToast();

  const loadAnalytics = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Load overall event analytics
      const analytics = await eventAnalyticsService.getEventAnalytics(eventId);
      setEventAnalytics(analytics);
      
      // Load daily metrics for the selected date range
      const metrics = await eventAnalyticsService.getEventDailyMetrics(
        eventId,
        dateRange.startDate,
        dateRange.endDate
      );
      setDailyMetrics(metrics);
      
      // Load referral sources
      const sources = await eventAnalyticsService.getReferralSourcesAnalytics(eventId);
      setReferralSources(sources);
      
      // Load ticket sales analytics
      const ticketAnalytics = await eventAnalyticsService.getTicketSalesAnalytics(eventId);
      setTicketSalesAnalytics(ticketAnalytics);
      
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load event analytics',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [eventId, dateRange]);

  // Track a page view for this event
  const trackEventView = async (referrer?: string) => {
    if (!eventId) return;
    
    try {
      await eventAnalyticsService.recordEventAnalyticsEvent(eventId, 'view', { referrer });
    } catch (err) {
      console.error('Error tracking event view:', err);
    }
  };

  // Track a ticket view for this event
  const trackTicketView = async () => {
    if (!eventId) return;
    
    try {
      await eventAnalyticsService.recordEventAnalyticsEvent(eventId, 'ticket_view');
    } catch (err) {
      console.error('Error tracking ticket view:', err);
    }
  };

  // Track a social share for this event
  const trackSocialShare = async () => {
    if (!eventId) return;
    
    try {
      await eventAnalyticsService.recordEventAnalyticsEvent(eventId, 'share');
    } catch (err) {
      console.error('Error tracking social share:', err);
    }
  };

  // Track a ticket purchase for this event
  const trackPurchase = async (quantity: number, amount: number) => {
    if (!eventId) return;
    
    try {
      await eventAnalyticsService.recordEventAnalyticsEvent(eventId, 'purchase', { quantity, amount });
    } catch (err) {
      console.error('Error tracking purchase:', err);
    }
  };
  
  // Track marketing campaign performance
  const trackCampaignConversion = async (
    campaignId: string, 
    conversionType: 'impression' | 'click' | 'conversion',
    data: {
      quantity?: number;
      revenue?: number;
      referrer?: string;
      source?: string;
    } = {}
  ) => {
    if (!eventId || !campaignId) return;
    
    try {
      await eventAnalyticsService.trackCampaignConversion(campaignId, eventId, conversionType, data);
    } catch (err) {
      console.error('Error tracking campaign conversion:', err);
    }
  };
  
  // Compare with other events
  const compareWithEvents = async (otherEventIds: string[]) => {
    if (!eventId) return [];
    
    try {
      const allEventIds = [...new Set([eventId, ...otherEventIds])];
      return await eventAnalyticsService.compareEvents(allEventIds);
    } catch (err) {
      console.error('Error comparing events:', err);
      return [];
    }
  };

  return {
    isLoading,
    error,
    eventAnalytics,
    dailyMetrics,
    referralSources,
    ticketSalesAnalytics,
    dateRange,
    setDateRange,
    refresh: loadAnalytics,
    trackEventView,
    trackTicketView,
    trackSocialShare,
    trackPurchase,
    trackCampaignConversion,
    compareWithEvents
  };
};
