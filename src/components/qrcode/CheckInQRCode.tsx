
import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRCodeLightbox from './QRCodeLightbox';
import { Button } from '@/components/ui/button';

interface CheckInQRCodeProps {
  swigCircuitId: string;
  establishmentId: string;
  userId: string;
}

const CheckInQRCode: React.FC<CheckInQRCodeProps> = ({ swigCircuitId, establishmentId, userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Create the QR code value as JSON
  const qrCodeValue = JSON.stringify({
    type: 'check-in',
    swigCircuitId,
    establishmentId,
    userId,
    timestamp: new Date().toISOString()
  });

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="w-full flex items-center justify-center"
        variant="outline"
      >
        <QrCode className="mr-2 h-4 w-4" />
        Show Check-In QR Code
      </Button>
      
      <QRCodeLightbox 
        value={qrCodeValue}
        title="Check-In QR Code" 
        subtitle="Present this code to the establishment host to check in"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default CheckInQRCode;
