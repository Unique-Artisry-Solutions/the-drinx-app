
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketPurchase, BulkTicketOperation } from '@/types/TicketManagementTypes';
import { Users, CheckSquare, X } from 'lucide-react';

interface BulkTicketOperationsProps {
  tickets: TicketPurchase[];
}

const BulkTicketOperations: React.FC<BulkTicketOperationsProps> = ({ tickets }) => {
  const { selectedTickets, setSelectedTickets, performBulkOperation, isBulkOperating } = useTicketManagement();
  const [selectedOperation, setSelectedOperation] = useState<BulkTicketOperation['operation']>('update_status');

  const handleSelectAll = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map(t => t.id));
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleBulkOperation = () => {
    if (selectedTickets.length === 0) return;

    const operation: BulkTicketOperation = {
      operation: selectedOperation,
      ticket_ids: selectedTickets,
      parameters: selectedOperation === 'update_status' ? { status: 'cancelled' } : undefined
    };

    performBulkOperation(operation);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Bulk Operations
          </CardTitle>
          <CardDescription>
            Select multiple tickets and perform bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedTickets.length === tickets.length && tickets.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm">
                Select All ({selectedTickets.length} of {tickets.length} selected)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={selectedOperation} onValueChange={(value: any) => setSelectedOperation(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cancel">Cancel Tickets</SelectItem>
                  <SelectItem value="refund">Request Refunds</SelectItem>
                  <SelectItem value="update_status">Update Status</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleBulkOperation}
                disabled={selectedTickets.length === 0 || isBulkOperating}
              >
                {isBulkOperating ? 'Processing...' : `Apply to ${selectedTickets.length} tickets`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedTickets.includes(ticket.id)}
                    onCheckedChange={() => handleSelectTicket(ticket.id)}
                  />
                  <div>
                    <p className="font-medium">{ticket.contact_name}</p>
                    <p className="text-sm text-muted-foreground">{ticket.contact_email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {ticket.quantity} tickets
                  </Badge>
                  <Badge variant={ticket.payment_status === 'completed' ? 'default' : 'secondary'}>
                    {ticket.payment_status}
                  </Badge>
                  <span className="text-sm font-medium">
                    ${ticket.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkTicketOperations;
