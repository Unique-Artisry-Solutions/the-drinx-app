
import { useEffect, useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TimeRange = '15m' | '1h' | '24h' | '7d';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

interface CommonParams {
  search?: string;
  timeRange?: TimeRange;
  autoRefresh?: boolean;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

const getSinceTimestamp = (range: TimeRange = '1h') => {
  const now = new Date();
  switch (range) {
    case '15m': return new Date(now.getTime() - 15 * 60 * 1000).toISOString();
    case '1h': return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
};

const usePagination = () => {
  const [page, setPage] = useState(1);
  const pageSize = 50;
  return { page, setPage, pageSize };
};

export const useHttpRequestLogs = (params: CommonParams & { method?: string; statusCode?: string; }) => {
  const { page, setPage, pageSize } = usePagination();
  const since = useMemo(() => getSinceTimestamp(params.timeRange), [params.timeRange]);

  const query = useQuery<PaginatedResult<Record<string, any>>>({
    queryKey: ['http_request_logs', params.search, params.method, params.statusCode, since, page],
    queryFn: async () => {
      let q = supabase
        .from('http_request_logs')
        .select('*', { count: 'exact' })
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (params.search) {
        q = q.ilike('path', `%${params.search}%`);
      }
      if (params.method) {
        q = q.eq('method', params.method);
      }
      if (params.statusCode) {
        if (params.statusCode.endsWith('xx')) {
          const prefix = parseInt(params.statusCode[0]);
          q = q.gte('status_code', prefix * 100).lt('status_code', (prefix + 1) * 100);
        } else {
          q = q.eq('status_code', Number(params.statusCode));
        }
      }

      const { data, error, count } = await q;
      if (error) throw error;
      return { items: data || [], total: count || 0, page, pageSize };
    },
    placeholderData: keepPreviousData,
    refetchInterval: params.autoRefresh ? 8000 : false,
  });

  useEffect(() => { setPage(1); }, [params.search, params.method, params.statusCode, since]);

  return { ...query, setPage };
};

export const usePaymentAuditLogs = (params: CommonParams) => {
  const { page, setPage, pageSize } = usePagination();
  const since = useMemo(() => getSinceTimestamp(params.timeRange), [params.timeRange]);

  const query = useQuery<PaginatedResult<Record<string, any>>>({
    queryKey: ['payment_audit_logs', params.search, since, page],
    queryFn: async () => {
      let q = supabase
        .from('payment_audit_logs')
        .select('*', { count: 'exact' })
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (params.search) {
        q = q.or(
          `action.ilike.%${params.search}%,provider.ilike.%${params.search}%,request_id.ilike.%${params.search}%`
        );
      }

      const { data, error, count } = await q;
      if (error) throw error;
      return { items: data || [], total: count || 0, page, pageSize };
    },
    placeholderData: keepPreviousData,
    refetchInterval: params.autoRefresh ? 8000 : false,
  });

  useEffect(() => { setPage(1); }, [params.search, since]);

  return { ...query, setPage };
};

export const useSecurityEventLogs = (params: CommonParams & { severity?: Severity }) => {
  const { page, setPage, pageSize } = usePagination();
  const since = useMemo(() => getSinceTimestamp(params.timeRange), [params.timeRange]);

  const query = useQuery<PaginatedResult<Record<string, any>>>({
    queryKey: ['security_event_logs', params.search, params.severity, since, page],
    queryFn: async () => {
      let q = supabase
        .from('security_event_logs')
        .select('*', { count: 'exact' })
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (params.search) {
        q = q.or(
          `event_type.ilike.%${params.search}%,endpoint.ilike.%${params.search}%`
        );
      }
      if (params.severity) {
        q = q.eq('severity', params.severity);
      }

      const { data, error, count } = await q;
      if (error) throw error;
      return { items: data || [], total: count || 0, page, pageSize };
    },
    placeholderData: keepPreviousData,
    refetchInterval: params.autoRefresh ? 8000 : false,
  });

  useEffect(() => { setPage(1); }, [params.search, params.severity, since]);

  return { ...query, setPage };
};

export const useSecurityAlerts = (params: CommonParams & { severity?: Severity }) => {
  const { page, setPage, pageSize } = usePagination();
  const since = useMemo(() => getSinceTimestamp(params.timeRange), [params.timeRange]);

  const query = useQuery<PaginatedResult<Record<string, any>>>({
    queryKey: ['security_alerts', params.search, params.severity, since, page],
    queryFn: async () => {
      let q = supabase
        .from('security_alerts')
        .select('*', { count: 'exact' })
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (params.search) {
        q = q.ilike('title', `%${params.search}%`);
      }
      if (params.severity) {
        q = q.eq('severity', params.severity);
      }

      const { data, error, count } = await q;
      if (error) throw error;
      return { items: data || [], total: count || 0, page, pageSize };
    },
    placeholderData: keepPreviousData,
    refetchInterval: params.autoRefresh ? 8000 : false,
  });

  useEffect(() => { setPage(1); }, [params.search, params.severity, since]);

  return { ...query, setPage };
};
