
import React from 'react';
import EnhancedQRScanner from '@/components/qrcode/EnhancedQRScanner';
import { QRCodeService, ScanResult } from '@/services/qrCodeService';

interface QrCodeScannerProps {
  onScan: (code: string) => Promise<void>;
  onClose?: () => void;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ onScan, onClose }) => {
  const handleScan = async (result: ScanResult) => {
    if (result.success && result.data) {
      const qrString = QRCodeService.generateQRCodeValue(result.data);
      await onScan(qrString);
    } else {
      throw new Error(result.error || 'Scan failed');
    }
  };

  return (
    <EnhancedQRScanner
      onScan={handleScan}
      onClose={onClose}
      allowOfflineScanning={true}
      showOfflineStatus={true}
    />
  );
};

export default QrCodeScanner;
