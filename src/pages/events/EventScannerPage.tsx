
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EventAttendee } from '@/types/EventTypes';
import QrCodeScanner from '@/components/events/QrCodeScanner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { processTicketScan } from '@/services/eventTicketService';

const EventScannerPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();
  const [ticketCode, setTicketCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastScannedAttendee, setLastScannedAttendee] = useState<EventAttendee | null>(null);

  const handleScan = async (code: string) => {
    if (!eventId) {
      toast({
        title: "Error",
        description: "Event ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processTicketScan(code, eventId);
      
      if (result.success) {
        toast({
          title: "Check-in Successful",
          description: result.message,
        });
        
        if (result.attendee) {
          setLastScannedAttendee(result.attendee);
        }
      } else {
        toast({
          title: "Check-in Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process ticket",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode.trim()) return;
    
    await handleScan(ticketCode.trim());
    setTicketCode('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Check-in Scanner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Scan QR Code</h3>
              <QrCodeScanner onScan={handleScan} />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Manual Entry</h3>
              <form onSubmit={handleManualEntry} className="space-y-4">
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
            </div>

            {lastScannedAttendee && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Last Check-in</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p><strong>Name:</strong> {lastScannedAttendee.name}</p>
                  <p><strong>Email:</strong> {lastScannedAttendee.email}</p>
                  <p><strong>Status:</strong> {lastScannedAttendee.status}</p>
                  <p><strong>Checked in at:</strong> {lastScannedAttendee.checked_in_at}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventScannerPage;
