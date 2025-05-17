
import React, { useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle, QrCode } from 'lucide-react';
import { checkInSwigCircuitAttendee } from '@/services/swigCircuitService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

interface SwigCircuitCheckInScannerProps {
  swigCircuitId: string;
  venueId: string;
  venueName: string;
}

const SwigCircuitCheckInScanner: React.FC<SwigCircuitCheckInScannerProps> = ({
  swigCircuitId,
  venueId,
  venueName
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const startScanner = () => {
    if (!scannerContainerRef.current) return;
    
    setIsScanning(true);
    setScanResult(null);
    
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    
    scannerRef.current.render(
      (decodedText) => onScanSuccess(decodedText),
      (error) => console.warn(error)
    );
  };
  
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };
  
  const onScanSuccess = async (decodedText: string) => {
    stopScanner();
    await processTicketCode(decodedText);
  };
  
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    await processTicketCode(manualCode.trim());
    setManualCode('');
  };
  
  const processTicketCode = async (code: string) => {
    setIsProcessing(true);
    
    try {
      const result = await checkInSwigCircuitAttendee(
        code,
        venueId,
        user?.id
      );
      
      setScanResult({
        success: true,
        message: 'Check-in successful!'
      });
      
      toast({
        title: "Check-in Successful",
        description: `Attendee has been checked in to ${venueName}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Check-in error:', error);
      
      setScanResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to check in attendee'
      });
      
      toast({
        title: "Check-in Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          Scan Swig Circuit Ticket
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {scanResult && (
          <Alert className={`mb-4 ${scanResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center">
              {scanResult.success ? (
                <Check className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <AlertDescription>{scanResult.message}</AlertDescription>
            </div>
          </Alert>
        )}
        
        <div ref={scannerContainerRef}>
          {isScanning ? (
            <div className="mb-4">
              <div id="qr-reader" className="w-full"></div>
              <Button 
                variant="outline" 
                className="mt-2 w-full" 
                onClick={stopScanner}
              >
                Cancel Scanning
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              className="w-full mb-4" 
              onClick={startScanner}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR Code
            </Button>
          )}
        </div>
        
        <div className="mt-4">
          <form onSubmit={handleManualSubmit}>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Or enter ticket code manually"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isProcessing || !manualCode.trim()}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwigCircuitCheckInScanner;
