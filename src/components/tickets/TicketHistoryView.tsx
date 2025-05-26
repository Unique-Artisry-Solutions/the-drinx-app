
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TicketManagementService } from '@/services/ticketManagementService';
import { Clock, User, FileText } from 'lucide-react';

interface TicketHistoryViewProps {
  ticketId: string;
}

const TicketHistoryView: React.FC<TicketHistoryViewProps> = ({ ticketId }) => {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['ticket-history', ticketId],
    queryFn: () => TicketManagementService.getTicketHistory(ticketId),
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return '🛒';
      case 'use':
        return '✅';
      case 'cancel':
        return '❌';
      case 'transfer':
        return '🔄';
      case 'refund':
        return '💰';
      case 'status_change':
        return '📝';
      default:
        return '📋';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'default';
      case 'use':
        return 'secondary';
      case 'cancel':
        return 'destructive';
      case 'transfer':
        return 'outline';
      case 'refund':
        return 'secondary';
      case 'status_change':
        return 'default';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Ticket History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No transaction history available
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTransactionIcon(transaction.transaction_type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Badge variant={getTransactionColor(transaction.transaction_type) as any}>
                        {transaction.transaction_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    {(transaction.from_status || transaction.to_status) && (
                      <div className="mt-1 text-sm">
                        {transaction.from_status && transaction.to_status ? (
                          <span>Status changed from <strong>{transaction.from_status}</strong> to <strong>{transaction.to_status}</strong></span>
                        ) : transaction.to_status ? (
                          <span>Status set to <strong>{transaction.to_status}</strong></span>
                        ) : null}
                      </div>
                    )}

                    {transaction.performed_by && (
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        Performed by: {transaction.performed_by}
                      </div>
                    )}

                    {transaction.notes && (
                      <div className="mt-1 flex items-start text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 mr-1 mt-0.5" />
                        <span>{transaction.notes}</span>
                      </div>
                    )}

                    {transaction.transaction_data && Object.keys(transaction.transaction_data).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(transaction.transaction_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
                {index < history.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketHistoryView;
