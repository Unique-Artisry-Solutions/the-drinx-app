
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SystemSettingAuditLog } from '@/types/SupabaseTables';

interface AuditLogFilters {
  settingKey?: string;
  changedBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<SystemSettingAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAuditLogs = async (filters?: AuditLogFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('system_settings_audit_log')
        .select('*')
        .order('changed_at', { ascending: false });
        
      // Apply filters
      if (filters) {
        if (filters.settingKey) {
          query = query.ilike('setting_key', `%${filters.settingKey}%`);
        }
        
        if (filters.changedBy) {
          query = query.eq('changed_by', filters.changedBy);
        }
        
        if (filters.dateFrom) {
          query = query.gte('changed_at', filters.dateFrom);
        }
        
        if (filters.dateTo) {
          query = query.lte('changed_at', filters.dateTo);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      setAuditLogs(data as SystemSettingAuditLog[]);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
      toast({
        title: 'Error',
        description: 'Failed to load audit logs. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSettingAuditHistory = async (settingKey: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('system_settings_audit_log')
        .select('*')
        .eq('setting_key', settingKey)
        .order('changed_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      return data as SystemSettingAuditLog[];
    } catch (err) {
      console.error('Error fetching setting audit history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load setting audit history');
      toast({
        title: 'Error',
        description: 'Failed to load setting audit history. Please try again.',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    auditLogs,
    isLoading,
    error,
    fetchAuditLogs,
    getSettingAuditHistory,
  };
};
