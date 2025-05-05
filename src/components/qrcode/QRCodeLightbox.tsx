
import React from 'react';
import { QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from 'react-qr-code';

export interface QRCodeLightboxProps {
  value: string;
  title?: string;
  subtitle?: string;
  description?: string; // Added description for backward compatibility
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeLightbox: React.FC<QRCodeLightboxProps> = ({ 
  value, 
  title = "Scan QR Code", 
  subtitle,
  description, // Support both subtitle and description
  isOpen,
  onClose
}) => {
  // Use description as subtitle if subtitle is not provided
  const displaySubtitle = subtitle || description;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {displaySubtitle && (
            <p className="text-sm text-muted-foreground">{displaySubtitle}</p>
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
