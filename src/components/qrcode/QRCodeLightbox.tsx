
import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface QRCodeLightboxProps {
  value: string;
  title?: string;
  description?: string;
}

const QRCodeLightbox: React.FC<QRCodeLightboxProps> = ({ 
  value, 
  title = "Scan QR Code", 
  description 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Import QRCodeSVG from react-qr-code only when needed
  const [QRCodeSVG, setQRCodeSVG] = useState<any>(null);
  
  const openLightbox = async () => {
    try {
      // Dynamically import the QR code component only when needed
      const qrModule = await import('react-qr-code');
      setQRCodeSVG(qrModule.default);
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to load QR code module:', error);
    }
  };

  return (
    <>
      <div 
        className="flex justify-center items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={openLightbox}
      >
        <div className="text-center">
          <QrCode className="h-14 w-14 mx-auto mb-1 text-material-primary" />
          <p className="text-xs text-material-on-surface-variant">Tap to enlarge QR code</p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </DialogHeader>
          
          <div className="flex items-center justify-center p-6 bg-white rounded-md">
            {QRCodeSVG && (
              <QRCodeSVG
                value={value}
                size={250}
                level="H"
                className="mx-auto"
              />
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-2">
            Scan this code to check in to this establishment
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCodeLightbox;
