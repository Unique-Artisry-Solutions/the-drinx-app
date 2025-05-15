
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getPromotionAuditLogs,
  getEstablishmentPromotionAuditLogs,
  getPromotionUsageAnalytics,
  type PromotionAuditLog,
  type PromotionUsageAnalytics
} from '@/lib/promotions/auditApi';

export interface UsePromotionAuditOptions {
  limit?: number;
  actionTypes?: string[];
  enabled?: boolean;
}

export function usePromotionAudit(promotionId?: string, options: UsePromotionAuditOptions = {}) {
  const {
    data: auditLogs = [],
    isLoading: isLoadingLogs,
    isError: isErrorLogs,
    error: logsError,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['promotionAuditLogs', promotionId, options],
    queryFn: () => getPromotionAuditLogs(
      promotionId!, 
      { 
        limit: options.limit || 100,
        actionTypes: options.actionTypes
      }
    ),
    enabled: !!promotionId && (options.enabled !== false),
  });

  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    isError: isErrorAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: ['promotionAnalytics', promotionId],
    queryFn: () => getPromotionUsageAnalytics(promotionId!),
    enabled: !!promotionId && (options.enabled !== false),
  });

  return {
    auditLogs,
    analytics,
    isLoadingLogs,
    isErrorLogs,
    logsError,
    isLoadingAnalytics,
    isErrorAnalytics,
    analyticsError,
    refetchLogs,
    refetchAnalytics
  };
}

export interface UseEstablishmentAuditOptions {
  limit?: number;
  actionTypes?: string[];
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export function useEstablishmentPromotionAudit(establishmentId?: string, options: UseEstablishmentAuditOptions = {}) {
  const [filters, setFilters] = useState(options);

  const {
    data: auditLogs = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['establishmentPromotionAudit', establishmentId, filters],
    queryFn: () => getEstablishmentPromotionAuditLogs(
      establishmentId!,
      { 
        limit: filters.limit || 100,
        actionTypes: filters.actionTypes,
        startDate: filters.startDate,
        endDate: filters.endDate
      }
    ),
    enabled: !!establishmentId && (options.enabled !== false),
  });

  const updateFilters = (newFilters: Partial<UseEstablishmentAuditOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    auditLogs,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    updateFilters
  };
}
