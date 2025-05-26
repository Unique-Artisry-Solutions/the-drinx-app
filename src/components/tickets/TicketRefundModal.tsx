
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketPurchase } from '@/types/TicketManagementTypes';
import { RefreshCw } from 'lucide-react';

interface TicketRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketPurchase | null;
}

const TicketRefundModal: React.FC<TicketRefundModalProps> = ({
  isOpen,
  onClose,
  ticket
}) => {
  const { requestRefund, isRequestingRefund } = useTicketManagement();
  const [reason, setReason] = useState('');

  const handleRefund = () => {
    if (!ticket) return;

    requestRefund(
      { ticketId: ticket.id, reason },
      {
        onSuccess: () => {
          setReason('');
          onClose();
        }
      }
    );
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Refund</DialogTitle>
          <DialogDescription>
            Request a refund for this ticket. Refund amount will depend on the cancellation policy.
          </DialogDescription>
        </DialogHeader>

        {ticket && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{ticket.purchase_details?.item_name || 'Event Ticket'}</h4>
              <p className="text-sm text-muted-foreground">
                Quantity: {ticket.quantity} | Total: ${ticket.total_amount.toFixed(2)}
              </p>
              {ticket.ticket_code && (
                <p className="text-xs text-muted-foreground">Code: {ticket.ticket_code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Refund (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for the refund request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Refund requests are subject to the event's cancellation policy. Processing may take 3-5 business days.
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleRefund}
            disabled={isRequestingRefund}
          >
            {isRequestingRefund ? (
              'Processing...'
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Request Refund
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketRefundModal;
