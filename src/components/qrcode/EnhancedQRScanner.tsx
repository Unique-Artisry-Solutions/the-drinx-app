
import React, { useState, useEffect, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScannerConfig } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QRCodeService, ScanResult } from '@/services/qrCodeService';
import { Check, Loader2, AlertTriangle, Wifi, WifiOff, RotateCcw } from 'lucide-react';

interface EnhancedQRScannerProps {
  onScan: (result: ScanResult) => Promise<void>;
  onClose?: () => void;
  allowOfflineScanning?: boolean;
  showOfflineStatus?: boolean;
}

const EnhancedQRScanner: React.FC<EnhancedQRScannerProps> = ({ 
  onScan, 
  onClose, 
  allowOfflineScanning = true,
  showOfflineStatus = true 
}) => {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(QRCodeService.isOnline());
  const [processing, setProcessing] = useState(false);
  const [offlineScanCount, setOfflineScanCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  
  const scannerId = 'enhanced-qrcode-scanner';
  const maxRetries = 3;

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update offline scan count
  useEffect(() => {
    const updateCount = () => {
      setOfflineScanCount(QRCodeService.getOfflineScanCount());
    };
    
    updateCount();
    const interval = setInterval(updateCount, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const scannerConfig: Html5QrcodeScannerConfig = {
    fps: 10,
    qrbox: { width: 280, height: 280 },
    aspectRatio: 1,
    formatsToSupport: [0], // QR Code only
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
    },
    showTorchButtonIfSupported: true,
    showZoomSliderIfSupported: true
  };

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    if (processing) return;

    setProcessing(true);
    setError(null);

    try {
      // Parse QR code
      const parseResult = QRCodeService.parseQRCode(decodedText);
      
      if (!parseResult.success || !parseResult.data) {
        throw new Error(parseResult.error || 'Invalid QR code');
      }

      // Validate QR code data
      if (!QRCodeService.validateQRData(parseResult.data)) {
        throw new Error('QR code validation failed');
      }

      // If offline and offline scanning is allowed, store for later processing
      if (!isOnline && allowOfflineScanning) {
        QRCodeService.storeOfflineScan(parseResult.data);
        setSuccess(true);
        setError(null);
        setOfflineScanCount(QRCodeService.getOfflineScanCount());
        
        const offlineResult: ScanResult = {
          ...parseResult,
          offline: true
        };
        
        await onScan(offlineResult);
        return;
      }

      // If offline and offline scanning not allowed
      if (!isOnline) {
        throw new Error('No internet connection. Online connection required for scanning.');
      }

      // Process scan online
      await onScan(parseResult);
      setSuccess(true);
      setRetryCount(0);

    } catch (error: any) {
      console.error('Scan processing error:', error);
      setError(error.message || 'Failed to process scan');
      
      // Implement retry logic for network errors
      if (error.message.includes('network') || error.message.includes('connection')) {
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            handleScanSuccess(decodedText);
          }, 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }
      }
      
      setSuccess(false);
    } finally {
      setProcessing(false);
    }
  }, [onScan, isOnline, allowOfflineScanning, processing, retryCount]);

  const handleScanError = useCallback((error: string) => {
    // Only log actual errors, not the constant scanning feedback
    if (!error.includes('NotFoundException') && !error.includes('NotFoundError')) {
      console.warn('QR scan error:', error);
    }
  }, []);

  const startScanning = () => {
    if (scanning) return;

    setScanning(true);
    setSuccess(false);
    setError(null);
    setRetryCount(0);

    try {
      const scanner = new Html5QrcodeScanner(scannerId, scannerConfig, false);
      
      scanner.render(handleScanSuccess, handleScanError);
    } catch (error) {
      console.error('Failed to start scanner:', error);
      setError('Failed to initialize camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (!scanning) return;

    try {
      const scanner = Html5QrcodeScanner.getCameras().then(() => {
        // Clear any existing scanner instance
        const element = document.getElementById(scannerId);
        if (element) {
          element.innerHTML = '';
        }
      });
    } catch (error) {
      console.error('Error stopping scanner:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError(null);
    setRetryCount(0);
    stopScanning();
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    if (!scanning) {
      startScanning();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-center flex-1">Enhanced QR Scanner</CardTitle>
          {showOfflineStatus && (
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="default" className="text-xs">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {offlineScanCount > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {offlineScanCount} scan{offlineScanCount > 1 ? 's' : ''} pending sync
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        {scanning && !success && !error ? (
          <div className="space-y-4">
            <div id={scannerId} className="w-full" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={stopScanning} className="flex-1">
                Cancel
              </Button>
              {retryCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Retry {retryCount}/{maxRetries}
                </Badge>
              )}
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              {processing ? (
                <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
              ) : (
                <Check className="h-8 w-8 text-green-600" />
              )}
            </div>
            <p className="text-green-600 font-medium text-lg">
              {processing ? 'Processing...' : 'Scan successful!'}
            </p>
            {!isOnline && allowOfflineScanning && (
              <p className="text-sm text-muted-foreground text-center">
                Scan stored offline. Will sync when connection is restored.
              </p>
            )}
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
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium text-lg">Scan Failed</p>
            <p className="text-sm text-muted-foreground text-center">{error}</p>
            <div className="flex space-x-2">
              <Button onClick={handleRetry}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>Close</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-500 text-center">
              Position the QR code within the camera view to scan.
            </p>
            {!isOnline && !allowOfflineScanning && (
              <Alert>
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  Internet connection required for scanning
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={startScanning} disabled={!isOnline && !allowOfflineScanning}>
              Start Enhanced Scan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedQRScanner;
