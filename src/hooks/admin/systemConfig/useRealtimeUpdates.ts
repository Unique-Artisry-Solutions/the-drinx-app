
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimeUpdatesProps {
  onSettingsChange?: () => void;
  onAuditLogChange?: () => void;
}

export const useRealtimeUpdates = ({
  onSettingsChange,
  onAuditLogChange,
}: UseRealtimeUpdatesProps) => {
  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('system-config-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_settings',
      }, () => {
        if (onSettingsChange) {
          onSettingsChange();
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_settings_audit_log',
      }, () => {
        if (onAuditLogChange) {
          onAuditLogChange();
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onSettingsChange, onAuditLogChange]);
};
