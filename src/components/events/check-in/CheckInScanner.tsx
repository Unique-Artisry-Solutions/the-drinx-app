
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QrCodeScanner from '@/components/events/QrCodeScanner';
import { processTicketScan } from '@/services/eventTicketService';
import { EventAttendee } from '@/types/EventTypes';
import { Check, AlertCircle } from 'lucide-react';

interface CheckInScannerProps {
  eventId: string;
  onCheckIn: (attendeeId: string) => Promise<void>;
  onSuccess: () => void;
}

const CheckInScanner: React.FC<CheckInScannerProps> = ({ eventId, onCheckIn, onSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{success: boolean; message: string, attendee?: EventAttendee} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
  };

  const handleScan = async (code: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await processTicketScan(code);
      
      if (result.success && result.ticket) {
        // Convert ticket to attendee format
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
        
        // Check if this attendee is for this event
        if (attendee.event_id === eventId) {
          await onCheckIn(attendee.id!);
          onSuccess();
          
          setScanResult({
            success: true,
            message: `${attendee.name || 'Attendee'} has been checked in.`,
            attendee
          });
          
          toast({
            title: "Check-in Successful",
            description: `${attendee.name || 'Attendee'} has been checked in.`,
          });
        } else {
          setScanResult({
            success: false,
            message: "This ticket is for a different event",
            attendee
          });
          
          toast({
            title: "Invalid Ticket",
            description: "This ticket is for a different event",
            variant: "destructive",
          });
        }
      } else {
        setScanResult({
          success: false,
          message: result.error || "Failed to validate ticket"
        });
        
        toast({
          title: "Check-in Failed",
          description: result.error || "Invalid ticket",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setScanResult({
        success: false,
        message: error.message || "Error processing ticket"
      });
      
      toast({
        title: "Error",
        description: error.message || "Error processing ticket",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        {isScanning ? (
          <QrCodeScanner 
            onScan={handleScan} 
            onClose={() => setIsScanning(false)} 
          />
        ) : (
          <Card className="bg-muted/40">
            <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">QR Code Scanner</h3>
                <p className="text-sm text-muted-foreground">
                  Scan attendee QR codes to check them in to the event
                </p>
                <Button onClick={startScanning}>
                  Start Scanner
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {scanResult && (
        <Alert variant={scanResult.success ? "default" : "destructive"}>
          <div className="flex items-start">
            {scanResult.success ? (
              <Check className="h-4 w-4 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5" />
            )}
            <div className="ml-2">
              <AlertTitle>
                {scanResult.success ? "Check-in Successful" : "Check-in Failed"}
              </AlertTitle>
              <AlertDescription className="text-sm">
                {scanResult.message}
                {scanResult.attendee && scanResult.attendee.name && (
                  <div className="font-medium mt-1">
                    Attendee: {scanResult.attendee.name}
                  </div>
                )}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default CheckInScanner;
