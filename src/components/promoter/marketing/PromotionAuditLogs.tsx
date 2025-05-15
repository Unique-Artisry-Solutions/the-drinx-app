
import React, { useState } from 'react';
import { usePromotionAudit } from '@/hooks/usePromotionAudit';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw, Clock, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PromotionAuditLogsProps {
  promotionId: string;
  limit?: number;
}

const actionTypeLabels: Record<string, string> = {
  'create': 'Created',
  'update': 'Updated',
  'redeem': 'Redeemed',
  'delete': 'Deleted',
  'validate': 'Validated',
  'automatic_apply': 'Auto Applied',
  'batch_create': 'Batch Created'
};

const statusIcons: Record<string, React.ReactNode> = {
  'success': <CheckCircle className="w-4 h-4 text-green-500" />,
  'failure': <XCircle className="w-4 h-4 text-red-500" />
};

export default function PromotionAuditLogs({ promotionId, limit = 50 }: PromotionAuditLogsProps) {
  const [actionFilter, setActionFilter] = useState<string | null>(null);

  const { 
    auditLogs,
    analytics, 
    isLoadingLogs,
    isErrorLogs,
    refetchLogs
  } = usePromotionAudit(promotionId, { 
    limit,
    actionTypes: actionFilter ? [actionFilter] : undefined
  });

  const formatMetadata = (metadata: Record<string, any> | undefined) => {
    if (!metadata) return '-';
    
    const displayKeys = Object.keys(metadata).filter(key => 
      !key.includes('error') && 
      key !== 'result' && 
      metadata[key] !== undefined && 
      metadata[key] !== null
    );
    
    if (displayKeys.length === 0) return '-';
    
    return displayKeys.map(key => {
      const value = metadata[key];
      if (typeof value === 'object') return `${key}: [Object]`;
      return `${key}: ${value}`;
    }).join(', ');
  };

  const handleRefresh = () => {
    refetchLogs();
  };

  if (isLoadingLogs) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" /> Loading Audit Logs
          </CardTitle>
          <CardDescription>
            Retrieving promotion activity history...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isErrorLogs) {
    return (
      <Card className="w-full bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <XCircle className="mr-2 h-5 w-5" /> Error Loading Audit Logs
          </CardTitle>
          <CardDescription className="text-red-600">
            There was an error retrieving the audit logs. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const redemptionCount = analytics?.redemption_count || 0;
  const validationCount = (analytics?.successful_validations || 0) + (analytics?.failed_validations || 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Promotion Audit Logs</CardTitle>
            <CardDescription>
              View detailed activity history for this promotion code
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select value={actionFilter || ''} onValueChange={(value) => setActionFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All actions</SelectItem>
                <SelectItem value="validate">Validations</SelectItem>
                <SelectItem value="redeem">Redemptions</SelectItem>
                <SelectItem value="automatic_apply">Auto Applications</SelectItem>
                <SelectItem value="create">Create Events</SelectItem>
                <SelectItem value="update">Update Events</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {analytics && (
          <div className="flex gap-4 mt-2">
            <div className="bg-muted rounded-lg p-2 text-center flex-1">
              <div className="text-2xl font-bold">{redemptionCount}</div>
              <div className="text-xs text-muted-foreground">Redemptions</div>
            </div>
            <div className="bg-muted rounded-lg p-2 text-center flex-1">
              <div className="text-2xl font-bold">{validationCount}</div>
              <div className="text-xs text-muted-foreground">Validations</div>
            </div>
            <div className="bg-muted rounded-lg p-2 text-center flex-1">
              <div className="text-2xl font-bold">{analytics?.auto_applied_count || 0}</div>
              <div className="text-xs text-muted-foreground">Auto Applications</div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {auditLogs.length === 0 ? (
          <div className="text-center py-10 border rounded-md flex flex-col items-center">
            <Search className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No audit logs found for this promotion</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.action_type === 'redeem' ? "default" : "outline"}>
                        {actionTypeLabels[log.action_type] || log.action_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {statusIcons[log.status] || log.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.user_id ? log.user_id.substring(0, 6) + "..." : "Anonymous"}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate hidden md:table-cell">
                      {log.details || formatMetadata(log.metadata)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
