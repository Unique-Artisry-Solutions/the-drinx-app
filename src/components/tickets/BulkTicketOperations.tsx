
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketPurchase } from '@/types/TicketManagementTypes';
import { Users, FileText, CreditCard, XCircle } from 'lucide-react';

interface BulkTicketOperationsProps {
  tickets: TicketPurchase[];
}

const BulkTicketOperations: React.FC<BulkTicketOperationsProps> = ({ tickets }) => {
  const { 
    selectedTickets, 
    setSelectedTickets, 
    performBulkOperation, 
    isBulkOperating 
  } = useTicketManagement();
  
  const [operation, setOperation] = useState<string>('');
  const [operationParams, setOperationParams] = useState<any>({});

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
    if (!operation || selectedTickets.length === 0) return;

    performBulkOperation({
      operation: operation as any,
      ticket_ids: selectedTickets,
      parameters: operationParams
    });
  };

  const renderOperationParams = () => {
    switch (operation) {
      case 'transfer':
        return (
          <div className="space-y-2">
            <Label htmlFor="bulk-email">Recipient Email</Label>
            <Input
              id="bulk-email"
              type="email"
              placeholder="Enter email address"
              value={operationParams.to_email || ''}
              onChange={(e) => setOperationParams({ ...operationParams, to_email: e.target.value })}
            />
          </div>
        );
      
      case 'refund':
        return (
          <div className="space-y-2">
            <Label htmlFor="bulk-reason">Refund Reason</Label>
            <Textarea
              id="bulk-reason"
              placeholder="Enter reason for bulk refund..."
              value={operationParams.reason || ''}
              onChange={(e) => setOperationParams({ ...operationParams, reason: e.target.value })}
            />
          </div>
        );
      
      case 'update_status':
        return (
          <div className="space-y-2">
            <Label htmlFor="bulk-status">New Status</Label>
            <Select 
              value={operationParams.status || ''} 
              onValueChange={(value) => setOperationParams({ ...operationParams, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getOperationIcon = (op: string) => {
    switch (op) {
      case 'transfer': return <Users className="h-4 w-4" />;
      case 'refund': return <CreditCard className="h-4 w-4" />;
      case 'cancel': return <XCircle className="h-4 w-4" />;
      case 'update_status': return <FileText className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>
            Perform operations on multiple tickets at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedTickets.length === tickets.length && tickets.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all">
              Select All ({selectedTickets.length} of {tickets.length} selected)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="operation">Operation</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger>
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">Transfer Tickets</SelectItem>
                <SelectItem value="refund">Request Refunds</SelectItem>
                <SelectItem value="cancel">Cancel Tickets</SelectItem>
                <SelectItem value="update_status">Update Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderOperationParams()}

          <Button
            onClick={handleBulkOperation}
            disabled={!operation || selectedTickets.length === 0 || isBulkOperating}
            className="w-full"
          >
            {isBulkOperating ? (
              'Processing...'
            ) : (
              <>
                {getOperationIcon(operation)}
                <span className="ml-2">
                  Apply to {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div 
            key={ticket.id}
            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
          >
            <Checkbox
              checked={selectedTickets.includes(ticket.id)}
              onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{ticket.purchase_details?.item_name || 'Event Ticket'}</h4>
                <span className="text-sm text-muted-foreground">
                  ${ticket.total_amount.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {ticket.contact_name} • {ticket.contact_email} • {ticket.payment_status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkTicketOperations;
