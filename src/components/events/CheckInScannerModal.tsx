
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { EventAttendee } from '@/types/EventTypes';
import QrCodeScanner from './QrCodeScanner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { processTicketScan } from '@/services/eventTicketService';

interface CheckInScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (attendee: EventAttendee) => void;
}

const CheckInScannerModal: React.FC<CheckInScannerModalProps> = ({
  isOpen,
  onClose,
  onCheckIn
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('scanner');
  const [ticketCode, setTicketCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleScan = async (code: string) => {
    setIsProcessing(true);
    try {
      const result = await processTicketScan(code);
      
      if (result.success && result.ticket) {
        const attendee: EventAttendee = {
          id: result.ticket.id,
          event_id: result.ticket.event_id,
          user_id: result.ticket.user_id || undefined,
          email: result.ticket.email || undefined,
          name: result.ticket.name || undefined,
          ticket_type_id: result.ticket.ticket_type_id || undefined,
          purchase_date: result.ticket.purchase_date,
          checked_in_at: result.ticket.checked_in_at || undefined,
          status: result.ticket.status as any,
          ticket_code: result.ticket.ticket_code || undefined,
          notes: result.ticket.notes || undefined,
          custom_fields: result.ticket.custom_fields || {}
        };
        
        toast({
          title: "Check-in Successful",
          description: "Attendee has been checked in.",
        });
        onCheckIn(attendee);
      } else {
        throw new Error(result.error || "Failed to validate ticket");
      }
    } catch (error: any) {
      toast({
        title: "Check-in Failed",
        description: error.message || "Failed to process ticket",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode.trim()) return;
    
    setIsProcessing(true);
    try {
      await handleScan(ticketCode.trim());
    } finally {
      setIsProcessing(false);
      setTicketCode('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check In Attendee</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="scanner" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner">Scan QR Code</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scanner">
            <div className="py-4">
              <QrCodeScanner onScan={handleScan} />
            </div>
          </TabsContent>
          
          <TabsContent value="manual">
            <form onSubmit={handleManualEntry} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ticketCode">Ticket Code</Label>
                <Input
                  id="ticketCode"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  placeholder="Enter ticket code"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isProcessing || !ticketCode.trim()} 
                className="w-full"
              >
                {isProcessing ? 'Processing...' : 'Check In'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInScannerModal;
