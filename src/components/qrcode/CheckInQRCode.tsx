
import React from 'react';
import { QrCode } from 'lucide-react';
import QRCodeLightbox from './QRCodeLightbox';

interface CheckInQRCodeProps {
  barCrawlId: string;
  establishmentId: string;
  userId: string;
}

const CheckInQRCode: React.FC<CheckInQRCodeProps> = ({ barCrawlId, establishmentId, userId }) => {
  // Create the QR code value as JSON
  const qrCodeValue = JSON.stringify({
    type: 'check-in',
    barCrawlId,
    establishmentId,
    userId,
    timestamp: new Date().toISOString()
  });

  return (
    <QRCodeLightbox 
      value={qrCodeValue}
      title="Check-In QR Code" 
      subtitle="Present this code to the establishment host to check in"
    />
  );
};

export default CheckInQRCode;
