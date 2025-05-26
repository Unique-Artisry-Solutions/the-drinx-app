
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketPurchase, BulkTicketOperation } from '@/types/TicketManagementTypes';
import { Package, Users, Send, RefreshCw, AlertTriangle } from 'lucide-react';

interface BulkTicketOperationsProps {
  tickets: TicketPurchase[];
}

const BulkTicketOperations: React.FC<BulkTicketOperationsProps> = ({ tickets }) => {
  const { selectedTickets, setSelectedTickets, performBulkOperation, isBulkOperating } = useTicketManagement();
  const [selectedOperation, setSelectedOperation] = useState<string>('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(tickets.map(t => t.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
    }
  };

  const handleBulkOperation = () => {
    if (!selectedOperation || selectedTickets.length === 0) return;

    const operation: BulkTicketOperation = {
      operation: selectedOperation as any,
      ticket_ids: selectedTickets,
      parameters: {}
    };

    performBulkOperation(operation, {
      onSuccess: () => {
        setSelectedTickets([]);
        setSelectedOperation('');
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'transfer': return <Send className="h-4 w-4" />;
      case 'refund': return <RefreshCw className="h-4 w-4" />;
      case 'cancel': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const canPerformOperation = (operation: string, ticket: TicketPurchase) => {
    switch (operation) {
      case 'transfer':
      case 'refund':
        return ticket.payment_status === 'completed';
      case 'cancel':
        return ticket.payment_status === 'pending' || ticket.payment_status === 'completed';
      case 'update_status':
        return true;
      default:
        return false;
    }
  };

  const eligibleTickets = selectedOperation 
    ? tickets.filter(ticket => canPerformOperation(selectedOperation, ticket))
    : tickets;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk Ticket Operations</h2>
        <p className="text-muted-foreground">
          Select multiple tickets to perform bulk operations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Operation Controls
          </CardTitle>
          <CardDescription>
            Choose an operation and select tickets to perform bulk actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedOperation} onValueChange={setSelectedOperation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">
                  <div className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Transfer Tickets
                  </div>
                </SelectItem>
                <SelectItem value="refund">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Refunds
                  </div>
                </SelectItem>
                <SelectItem value="cancel">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Cancel Tickets
                  </div>
                </SelectItem>
                <SelectItem value="update_status">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Update Status
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedTickets.length === eligibleTickets.length && eligibleTickets.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm">
                Select All ({eligibleTickets.length})
              </label>
            </div>

            <Badge variant="outline">
              {selectedTickets.length} selected
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleBulkOperation}
              disabled={!selectedOperation || selectedTickets.length === 0 || isBulkOperating}
            >
              {isBulkOperating ? (
                'Processing...'
              ) : (
                <>
                  {selectedOperation && getOperationIcon(selectedOperation)}
                  <span className="ml-2">
                    Execute on {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''}
                  </span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ticket List</CardTitle>
          <CardDescription>
            {selectedOperation ? 
              `Showing ${eligibleTickets.length} tickets eligible for ${selectedOperation}` :
              `Showing all ${tickets.length} tickets`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eligibleTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  selectedTickets.includes(ticket.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedTickets.includes(ticket.id)}
                    onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
                  />
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {ticket.purchase_details?.item_name || 'Event Ticket'}
                      </h4>
                      <Badge variant={getStatusColor(ticket.payment_status) as any}>
                        {ticket.payment_status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.contact_name} • {ticket.contact_email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {ticket.quantity} • ${ticket.total_amount.toFixed(2)} • 
                      {ticket.ticket_code && ` Code: ${ticket.ticket_code}`}
                    </div>
                  </div>
                </div>

                {selectedOperation && !canPerformOperation(selectedOperation, ticket) && (
                  <Badge variant="secondary" className="text-xs">
                    Not Eligible
                  </Badge>
                )}
              </div>
            ))}

            {eligibleTickets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {selectedOperation ? 
                    `No tickets eligible for ${selectedOperation}` : 
                    'No tickets found'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkTicketOperations;
