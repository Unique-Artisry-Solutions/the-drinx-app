
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketPurchase } from '@/types/TicketManagementTypes';
import TicketInventoryManager from './TicketInventoryManager';
import BulkTicketOperations from './BulkTicketOperations';
import CancellationPolicyManager from './CancellationPolicyManager';
import TicketTransferModal from './TicketTransferModal';
import TicketRefundModal from './TicketRefundModal';
import { Package, Users, CreditCard, Settings, Send, RefreshCw } from 'lucide-react';

interface TicketManagementDashboardProps {
  eventId?: string;
  swigCircuitId?: string;
}

const TicketManagementDashboard: React.FC<TicketManagementDashboardProps> = ({
  eventId,
  swigCircuitId
}) => {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketPurchase | null>(null);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['ticket-purchases', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getTicketPurchases({
      eventId,
      swigCircuitId
    }),
  });

  const handleTransferTicket = (ticket: TicketPurchase) => {
    setSelectedTicket(ticket);
    setTransferModalOpen(true);
  };

  const handleRefundTicket = (ticket: TicketPurchase) => {
    setSelectedTicket(ticket);
    setRefundModalOpen(true);
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

  if (isLoading) {
    return <div>Loading ticket management dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ticket Management</h1>
        <p className="text-muted-foreground">
          Manage tickets, inventory, transfers, and refunds
        </p>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Tickets</CardTitle>
              <CardDescription>
                View and manage individual ticket purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets?.map((ticket) => (
                  <div 
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
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
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransferTicket(ticket)}
                        disabled={ticket.payment_status !== 'completed'}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Transfer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefundTicket(ticket)}
                        disabled={ticket.payment_status !== 'completed'}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refund
                      </Button>
                    </div>
                  </div>
                ))}
                
                {tickets?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No tickets found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <TicketInventoryManager 
            eventId={eventId} 
            swigCircuitId={swigCircuitId} 
          />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkTicketOperations tickets={tickets || []} />
        </TabsContent>

        <TabsContent value="policies">
          <CancellationPolicyManager 
            eventId={eventId} 
            swigCircuitId={swigCircuitId} 
          />
        </TabsContent>
      </Tabs>

      <TicketTransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        ticket={selectedTicket}
      />

      <TicketRefundModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default TicketManagementDashboard;
