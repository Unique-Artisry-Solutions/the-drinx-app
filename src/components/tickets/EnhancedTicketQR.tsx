
import React, { useState, useMemo } from 'react';
import { QrCode, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import QRCode from 'react-qr-code';
import { QRCodeService } from '@/services/qrCodeService';
import { TicketPurchase } from '@/types/TicketManagementTypes';
import QRCodeLightbox from '@/components/qrcode/QRCodeLightbox';

interface EnhancedTicketQRProps {
  ticket: TicketPurchase;
  size?: number;
  showActions?: boolean;
  className?: string;
}

const EnhancedTicketQR: React.FC<EnhancedTicketQRProps> = ({
  ticket,
  size = 200,
  showActions = true,
  className = ''
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Generate QR code data
  const qrData = useMemo(() => {
    return QRCodeService.generateTicketQRData(ticket);
  }, [ticket]);

  const qrValue = useMemo(() => {
    return QRCodeService.generateQRCodeValue(qrData);
  }, [qrData]);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svg = document.querySelector('#ticket-qr-code svg') as SVGElement;
    
    if (!ctx || !svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `ticket-qr-${ticket.ticket_code || ticket.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Event Ticket QR Code',
          text: `QR Code for ${ticket.purchase_details?.item_name || 'Event Ticket'}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(qrValue);
        // You might want to show a toast here
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Ticket QR Code
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              ID: {qrData.id}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div 
              id="ticket-qr-code"
              className="p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setIsLightboxOpen(true)}
            >
              <QRCode
                value={qrValue}
                size={size}
                level="H"
                className="mx-auto"
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {ticket.purchase_details?.item_name || 'Event Ticket'}
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Ticket Code: {ticket.ticket_code || 'N/A'}</p>
              <p>Generated: {new Date(qrData.timestamp).toLocaleString()}</p>
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLightboxOpen(true)}
                className="flex-1"
              >
                <QrCode className="h-4 w-4 mr-2" />
                View Full Size
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Present this QR code at the event for check-in
          </div>
        </CardContent>
      </Card>

      <QRCodeLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        value={qrValue}
        title="Event Ticket QR Code"
        subtitle={`${ticket.purchase_details?.item_name || 'Event Ticket'} - ${ticket.ticket_code || ticket.id}`}
      />
    </div>
  );
};

export default EnhancedTicketQR;
