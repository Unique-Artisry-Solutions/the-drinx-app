
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QRCodeService, ScanResult } from '@/services/qrCodeService';
import { Camera, RefreshCw, X, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface EnhancedQRScannerProps {
  onScan: (result: ScanResult) => Promise<void>;
  onClose?: () => void;
  allowOfflineScanning?: boolean;
  showOfflineStatus?: boolean;
}

interface CameraDevice {
  id: string;
  label: string;
}

const EnhancedQRScanner: React.FC<EnhancedQRScannerProps> = ({
  onScan,
  onClose,
  allowOfflineScanning = false,
  showOfflineStatus = false
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(QRCodeService.isOnline());
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [scanAttempts, setScanAttempts] = useState(0);
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

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

  // Load available cameras
  useEffect(() => {
    const loadCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        const cameraDevices: CameraDevice[] = devices.map(device => ({
          id: device.id,
          label: device.label || `Camera ${device.id}`
        }));
        setCameras(cameraDevices);
        
        // Select the first back camera or first available camera
        const backCamera = cameraDevices.find(camera => 
          camera.label.toLowerCase().includes('back') || 
          camera.label.toLowerCase().includes('rear')
        );
        setSelectedCamera(backCamera?.id || cameraDevices[0]?.id || '');
      } catch (error) {
        console.error('Failed to load cameras:', error);
        setError('Failed to access cameras. Please check permissions.');
      }
    };

    loadCameras();
  }, []);

  // Initialize scanner
  useEffect(() => {
    if (!selectedCamera || !elementRef.current) return;

    const startScanner = async () => {
      try {
        setIsScanning(true);
        setError(null);

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
        };

        const scanner = new Html5QrcodeScanner(
          "qr-scanner-container",
          config,
          false
        );

        scannerRef.current = scanner;

        const onScanSuccess = async (decodedText: string) => {
          // Prevent rapid consecutive scans
          const now = Date.now();
          if (now - lastScanTime < 1000) return;
          setLastScanTime(now);

          try {
            const result = QRCodeService.parseQRCode(decodedText);
            
            if (result.success && result.data) {
              // Validate QR code data
              if (QRCodeService.validateQRData(result.data)) {
                await onScan(result);
                scanner.clear();
                setIsScanning(false);
              } else {
                throw new Error('Invalid or expired QR code');
              }
            } else {
              throw new Error(result.error || 'Failed to parse QR code');
            }
          } catch (error: any) {
            console.error('QR scan error:', error);
            
            // Store for offline processing if allowed and offline
            if (allowOfflineScanning && !isOnline) {
              try {
                const offlineResult = QRCodeService.parseQRCode(decodedText);
                if (offlineResult.success && offlineResult.data) {
                  QRCodeService.storeOfflineScan(offlineResult.data);
                  await onScan({ 
                    ...offlineResult, 
                    offline: true 
                  });
                  scanner.clear();
                  setIsScanning(false);
                  return;
                }
              } catch (offlineError) {
                console.error('Offline scan storage failed:', offlineError);
              }
            }
            
            setScanAttempts(prev => prev + 1);
            setError(error.message || 'Failed to process QR code');
            
            // Auto-retry after a few seconds for certain errors
            if (scanAttempts < 3 && error.message?.includes('Invalid')) {
              setTimeout(() => setError(null), 2000);
            }
          }
        };

        const onScanFailure = (error: string) => {
          // Only log errors that aren't just "No QR code found"
          if (!error.includes('NotFoundException')) {
            console.warn('QR scan failure:', error);
          }
        };

        scanner.render(onScanSuccess, onScanFailure);
      } catch (error: any) {
        console.error('Scanner initialization failed:', error);
        setError('Failed to initialize camera scanner');
        setIsScanning(false);
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.warn('Error clearing scanner:', error);
        }
      }
      setIsScanning(false);
    };
  }, [selectedCamera, onScan, allowOfflineScanning, isOnline, scanAttempts, lastScanTime]);

  const handleRetry = useCallback(() => {
    setError(null);
    setScanAttempts(0);
    // The useEffect will reinitialize the scanner
  }, []);

  const handleCameraChange = useCallback((cameraId: string) => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setSelectedCamera(cameraId);
    setError(null);
    setScanAttempts(0);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            QR Code Scanner
          </CardTitle>
          <div className="flex items-center gap-2">
            {showOfflineStatus && (
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? (
                  <Wifi className="h-3 w-3 mr-1" />
                ) : (
                  <WifiOff className="h-3 w-3 mr-1" />
                )}
                {isOnline ? "Online" : "Offline"}
              </Badge>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Camera Selection */}
        {cameras.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Camera</label>
            <select
              value={selectedCamera}
              onChange={(e) => handleCameraChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scanner Container */}
        <div className="relative">
          <div
            id="qr-scanner-container"
            ref={elementRef}
            className="w-full rounded-lg overflow-hidden bg-black"
            style={{ minHeight: '300px' }}
          />
          
          {isScanning && (
            <div className="absolute top-2 left-2">
              <Badge variant="default">Scanning...</Badge>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Offline Mode Info */}
        {allowOfflineScanning && !isOnline && (
          <Alert>
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              Offline mode: Scans will be stored locally and synced when online
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Position the QR code within the camera frame</p>
          <p>The scanner will automatically detect and process the code</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedQRScanner;
