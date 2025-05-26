
import React, { useState, useEffect } from 'react';
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
import { RefundCalculation } from '@/types/TicketManagementTypes';
import { CreditCard, AlertTriangle } from 'lucide-react';

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
  const { requestRefund, isRequestingRefund, calculateRefund } = useTicketManagement();
  const [reason, setReason] = useState('');
  const [refundCalculation, setRefundCalculation] = useState<RefundCalculation | null>(null);
  const [calculationLoading, setCalculationLoading] = useState(false);

  useEffect(() => {
    if (ticket && isOpen) {
      setCalculationLoading(true);
      calculateRefund(ticket.id)
        .then(setRefundCalculation)
        .catch(console.error)
        .finally(() => setCalculationLoading(false));
    }
  }, [ticket, isOpen, calculateRefund]);

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
    setRefundCalculation(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Refund</DialogTitle>
          <DialogDescription>
            Request a refund for this ticket. Refund amount depends on the cancellation policy.
          </DialogDescription>
        </DialogHeader>

        {ticket && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{ticket.purchase_details?.item_name || 'Event Ticket'}</h4>
              <p className="text-sm text-muted-foreground">
                Quantity: {ticket.quantity} | Total Paid: ${ticket.total_amount.toFixed(2)}
              </p>
              {ticket.ticket_code && (
                <p className="text-xs text-muted-foreground">Code: {ticket.ticket_code}</p>
              )}
            </div>

            {calculationLoading ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Calculating refund amount...</p>
              </div>
            ) : refundCalculation ? (
              <div className="p-3 border rounded-lg space-y-2">
                <h5 className="font-medium">Refund Breakdown</h5>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Refund Percentage:</span>
                    <span>{refundCalculation.refund_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span>${refundCalculation.processing_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Refund:</span>
                    <span className="text-green-600">${refundCalculation.refund_amount.toFixed(2)}</span>
                  </div>
                </div>
                
                {refundCalculation.refund_amount === 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-xs text-red-700">
                      No refund available due to cancellation policy
                    </span>
                  </div>
                )}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Refund</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why you're requesting a refund..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Refund requests are subject to review and the event's cancellation policy.
              Processing may take 3-5 business days.
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleRefund}
            disabled={!reason || isRequestingRefund || !refundCalculation}
          >
            {isRequestingRefund ? (
              'Processing...'
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
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
