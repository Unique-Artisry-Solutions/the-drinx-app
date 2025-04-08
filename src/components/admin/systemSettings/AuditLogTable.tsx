
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  setting_key: string;
  old_value: any;
  new_value: any;
  changed_by: string | null;
  changed_at: string;
  change_reason: string | null;
}

const AuditLogTable: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAuditLog();
  }, []);

  const fetchAuditLog = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings_audit_log')
        .select('*')
        .order('changed_at', { ascending: false });

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (err: any) {
      console.error('Error fetching audit log:', err);
      toast({
        title: 'Error',
        description: 'Could not load audit log data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: any) => {
    if (value === null) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No changes have been recorded in the audit log.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Setting Key</TableHead>
          <TableHead>Changed At</TableHead>
          <TableHead>Changed By</TableHead>
          <TableHead>Old Value</TableHead>
          <TableHead>New Value</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">{log.setting_key}</TableCell>
            <TableCell>{format(new Date(log.changed_at), 'MMM d, yyyy h:mm a')}</TableCell>
            <TableCell>{log.changed_by || 'System'}</TableCell>
            <TableCell className="max-w-[150px] truncate">
              {formatValue(log.old_value)}
            </TableCell>
            <TableCell className="max-w-[150px] truncate">
              {formatValue(log.new_value)}
            </TableCell>
            <TableCell>{log.change_reason || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuditLogTable;
