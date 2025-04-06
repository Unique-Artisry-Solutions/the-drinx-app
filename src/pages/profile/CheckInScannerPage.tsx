
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/navigation/BackButton';
import { useAuth } from '@/contexts/auth';
import { supabaseClient } from '@/lib/supabaseClient';

interface CheckInScannerProps {}

const CheckInScannerPage: React.FC<CheckInScannerProps> = () => {
  const { id: barCrawlId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{success: boolean; message: string} | null>(null);
  const [scanner, setScanner] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [barCrawl, setBarCrawl] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load bar crawl data
  useEffect(() => {
    const fetchBarCrawl = async () => {
      try {
        // This would fetch the actual bar crawl data in production
        setBarCrawl({
          id: barCrawlId,
          name: 'Downtown Mocktail Tour',
          establishments: ['Establishment A', 'Establishment B', 'Establishment C']
        });
      } catch (error) {
        console.error('Error fetching bar crawl:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bar crawl data',
          variant: 'destructive'
        });
      }
    };
    
    if (barCrawlId) {
      fetchBarCrawl();
    }
  }, [barCrawlId, toast]);
  
  // Initialize scanner when component mounts
  useEffect(() => {
    const initScanner = async () => {
      try {
        // Dynamically import the scanner library
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        
        const newScanner = new Html5QrcodeScanner(
          "qr-reader", 
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
            formatsToSupport: [0], // QR Code only
          },
          false
        );
        
        setScanner(newScanner);
      } catch (error) {
        console.error('Failed to initialize QR scanner:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize QR scanner',
          variant: 'destructive'
        });
      }
    };
    
    initScanner();
    
    // Clean up scanner on unmount
    return () => {
      if (scanner && scanning) {
        scanner.clear();
      }
    };
  }, [toast]);
  
  const startScanning = () => {
    if (!scanner) return;
    
    setScanning(true);
    setScanResult(null);
    
    scanner.render(
      (decodedText: string) => {
        handleScanSuccess(decodedText);
      },
      (errorMessage: string) => {
        console.error('QR scan error:', errorMessage);
      }
    );
  };
  
  const stopScanning = () => {
    if (scanner && scanning) {
      scanner.clear();
      setScanning(false);
    }
  };
  
  const handleScanSuccess = async (decodedText: string) => {
    try {
      stopScanning();
      setIsLoading(true);
      
      // Parse the QR code data
      let qrData;
      try {
        qrData = JSON.parse(decodedText);
      } catch (e) {
        setScanResult({
          success: false,
          message: 'Invalid QR code format'
        });
        return;
      }
      
      if (qrData.type !== 'check-in') {
        setScanResult({
          success: false,
          message: 'This QR code is not for check-ins'
        });
        return;
      }
      
      // In a real app, validate the QR code with the server
      // For now, simulate a successful check-in
      await processCheckIn(qrData);
      
    } catch (error) {
      console.error('Error processing scan:', error);
      setScanResult({
        success: false,
        message: 'Failed to process check-in'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const processCheckIn = async (qrData: any) => {
    // In production, we'd make an API call to validate and record the check-in
    
    // Simulate a server call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, always succeed
    setScanResult({
      success: true,
      message: 'Successfully checked in!'
    });
    
    toast({
      title: 'Check-in successful',
      description: 'You have been checked in to this establishment',
    });
  };
  
  return (
    <Layout>
      <div className="container max-w-lg mx-auto p-4">
        <BackButton fallbackPath="/profile/bar-crawls" />
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Check-In Scanner
            </CardTitle>
            <CardDescription>
              {barCrawl?.name ? `Scanning for ${barCrawl.name}` : 'Scan a participant\'s QR code to check them in'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {scanResult ? (
              <div className={`p-4 rounded-lg text-center ${scanResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                {scanResult.success ? (
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                ) : (
                  <XCircle className="h-12 w-12 mx-auto text-red-500 mb-2" />
                )}
                <p className={`text-lg font-medium ${scanResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {scanResult.success ? 'Check-in Successful!' : 'Check-in Failed'}
                </p>
                <p className={`mt-1 ${scanResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {scanResult.message}
                </p>
                <div className="mt-4">
                  <Button onClick={() => setScanResult(null)}>
                    Scan Another Code
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div id="qr-reader" className="w-full max-w-sm mx-auto"></div>
                <div className="text-center">
                  {scanning ? (
                    <Button variant="outline" onClick={stopScanning} disabled={isLoading}>
                      Cancel Scan
                    </Button>
                  ) : (
                    <Button onClick={startScanning} disabled={isLoading || !scanner}>
                      Start Scanning
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CheckInScannerPage;
