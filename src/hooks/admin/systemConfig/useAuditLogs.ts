
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SystemSettingAuditLog } from '@/types/SupabaseTables';

export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<SystemSettingAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch audit logs
  const fetchAuditLogs = async (limit = 50) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('system_settings_audit_log')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(limit);
        
      if (error) throw new Error(error.message);
      setAuditLogs(data as SystemSettingAuditLog[]);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
      toast({
        title: 'Error',
        description: 'Failed to load audit logs',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    auditLogs,
    isLoading,
    error,
    fetchAuditLogs
  };
};
