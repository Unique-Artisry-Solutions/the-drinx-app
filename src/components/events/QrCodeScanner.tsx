
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';

interface QrCodeScannerProps {
  onScan: (code: string) => Promise<void>;
  onClose?: () => void;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerId = 'html5-qrcode-scanner';
  
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (scanning) {
      scanner = new Html5QrcodeScanner(
        scannerId,
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          formatsToSupport: [0, 1] // QR code and Code 39
        },
        false
      );

      scanner.render(async (decodedText) => {
        if (decodedText) {
          scanner.clear();
          setScanning(false);
          setSuccess(true);
          
          try {
            await onScan(decodedText);
          } catch (err: any) {
            setError(err.message || 'Error processing ticket');
            setSuccess(false);
          }
        }
      }, (error) => {
        // Ignoring errors during scan as they're usually temporary
      });
    }

    return () => {
      if (scanner) {
        try {
          scanner.clear();
        } catch (error) {
          console.error('Failed to clear scanner', error);
        }
      }
    };
  }, [scanning, onScan]);

  const startScanning = () => {
    setScanning(true);
    setSuccess(false);
    setError(null);
  };

  const handleReset = () => {
    setSuccess(false);
    setError(null);
    setScanning(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Scan Ticket QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        {scanning ? (
          <div className="space-y-4">
            <div id={scannerId} className="w-full" />
            <Button variant="outline" onClick={() => setScanning(false)}>Cancel</Button>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-green-600 font-medium text-lg">Ticket scanned successfully!</p>
            <div className="flex space-x-2">
              <Button onClick={handleReset}>Scan Another</Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>Close</Button>
              )}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="h-8 w-8 text-red-600">!</span>
            </div>
            <p className="text-red-600 font-medium text-lg">Error: {error}</p>
            <div className="flex space-x-2">
              <Button onClick={handleReset}>Try Again</Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>Close</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-500 text-center">
              Position the QR code within the camera view to scan the ticket.
            </p>
            <Button onClick={startScanning}>Start Scanning</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QrCodeScanner;
