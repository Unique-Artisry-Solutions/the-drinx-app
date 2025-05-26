
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QRCodeService } from '@/services/qrCodeService';
import { Wifi, WifiOff, RefreshCw, Trash2, Check } from 'lucide-react';

interface OfflineSyncManagerProps {
  onSyncComplete?: (successCount: number, failureCount: number) => void;
}

const OfflineSyncManager: React.FC<OfflineSyncManagerProps> = ({ onSyncComplete }) => {
  const [offlineScans, setOfflineScans] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(QRCodeService.isOnline());
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<{ success: number; failed: number } | null>(null);

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

  // Load offline scans
  useEffect(() => {
    const loadScans = () => {
      const scans = QRCodeService.getOfflineScans();
      setOfflineScans(scans.filter(scan => !scan.processed));
    };

    loadScans();
    const interval = setInterval(loadScans, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSyncAll = async () => {
    if (!isOnline || syncing) return;

    setSyncing(true);
    setSyncResults(null);

    let successCount = 0;
    let failureCount = 0;

    for (const scan of offlineScans) {
      try {
        // Simulate API call to process the scan
        // In real implementation, this would call your backend API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        QRCodeService.markOfflineScanProcessed(scan.id);
        successCount++;
      } catch (error) {
        console.error('Failed to sync scan:', scan.id, error);
        failureCount++;
      }
    }

    setSyncResults({ success: successCount, failed: failureCount });
    setSyncing(false);

    // Refresh the list
    const remainingScans = QRCodeService.getOfflineScans().filter(scan => !scan.processed);
    setOfflineScans(remainingScans);

    onSyncComplete?.(successCount, failureCount);
  };

  const handleClearAll = () => {
    QRCodeService.clearProcessedOfflineScans();
    setOfflineScans([]);
    setSyncResults(null);
  };

  const handleDeleteScan = (scanId: string) => {
    const updatedScans = offlineScans.filter(scan => scan.id !== scanId);
    setOfflineScans(updatedScans);
    
    // Update localStorage
    const allScans = QRCodeService.getOfflineScans();
    const filteredScans = allScans.filter(scan => scan.id !== scanId);
    localStorage.setItem('qr_offline_scans', JSON.stringify(filteredScans));
  };

  if (offlineScans.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <div className="flex items-center justify-center mb-2">
            {isOnline ? (
              <Wifi className="h-8 w-8 text-green-500" />
            ) : (
              <WifiOff className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <p className="text-muted-foreground">No offline scans pending</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <WifiOff className="h-5 w-5 mr-2" />
            Offline Scans
          </CardTitle>
          <Badge variant={isOnline ? "default" : "secondary"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {syncResults && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              Sync complete: {syncResults.success} successful, {syncResults.failed} failed
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {offlineScans.map((scan, index) => (
            <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{scan.type} scan</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(scan.scannedAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteScan(scan.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSyncAll}
            disabled={!isOnline || syncing}
            className="flex-1"
          >
            {syncing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync All ({offlineScans.length})
          </Button>
          <Button
            variant="outline"
            onClick={handleClearAll}
            disabled={syncing}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {!isOnline && (
          <Alert>
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              Connect to internet to sync offline scans
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineSyncManager;
