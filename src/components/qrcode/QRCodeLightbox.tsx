
import React from 'react';
import { QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from 'react-qr-code';

export interface QRCodeLightboxProps {
  value: string;
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeLightbox: React.FC<QRCodeLightboxProps> = ({ 
  value, 
  title = "Scan QR Code", 
  subtitle,
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </DialogHeader>
        
        <div className="flex items-center justify-center p-6 bg-white rounded-md">
          <QRCode
            value={value}
            size={250}
            level="H"
            className="mx-auto"
          />
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-2">
          Scan this code to check in to this event
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeLightbox;
