
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketPurchase } from '@/types/TicketManagementTypes';
import { Send } from 'lucide-react';

interface TicketTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketPurchase | null;
}

const TicketTransferModal: React.FC<TicketTransferModalProps> = ({
  isOpen,
  onClose,
  ticket
}) => {
  const { transferTicket, isTransferring } = useTicketManagement();
  const [toEmail, setToEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = () => {
    if (!ticket || !toEmail) return;

    transferTicket(
      { ticketId: ticket.id, toEmail },
      {
        onSuccess: () => {
          setToEmail('');
          setMessage('');
          onClose();
        }
      }
    );
  };

  const handleClose = () => {
    setToEmail('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Ticket</DialogTitle>
          <DialogDescription>
            Transfer this ticket to another person. They will receive an email with instructions to claim it.
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
              <Label htmlFor="toEmail">Recipient Email</Label>
              <Input
                id="toEmail"
                type="email"
                placeholder="Enter recipient's email address"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="text-xs text-muted-foreground">
              The transfer link will expire in 24 hours. The recipient must have an account to claim the ticket.
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer}
            disabled={!toEmail || isTransferring}
          >
            {isTransferring ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Transfer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketTransferModal;
