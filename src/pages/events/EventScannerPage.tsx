
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QrCodeScanner from '@/components/events/QrCodeScanner';
import { verifyEventAccessToken } from '@/services/eventAccessService';
import { processTicketScan } from '@/services/eventTicketService';
import { EventAttendee } from '@/types/EventTypes';
import { supabase } from '@/integrations/supabase/client';

const EventScannerPage = () => {
  const { eventId, token } = useParams<{ eventId: string; token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [eventName, setEventName] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [recentScans, setRecentScans] = useState<Array<{ attendee: EventAttendee; timestamp: string; success: boolean }>>([]);

  useEffect(() => {
    const validateToken = async () => {
      if (!eventId || !token) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify the access token
        const isTokenValid = await verifyEventAccessToken(eventId, token);
        
        if (isTokenValid) {
          // Get event details
          const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('name')
            .eq('id', eventId)
            .single();
            
          if (eventError) throw eventError;
          
          setEventName(eventData.name);
          setIsValid(true);
        } else {
          setIsValid(false);
          toast({
            title: "Invalid Access",
            description: "This scanner link is invalid or has expired.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [eventId, token, toast]);

  const handleScan = async (code: string): Promise<void> => {
    if (!eventId) return;
    
    try {
      // Process the ticket scan
      const result = await processTicketScan(code);
      
      // Update scan result status
      setScanResult({
        success: result.success,
        message: result.message
      });
      
      // Add to recent scans
      if (result.attendee) {
        setRecentScans(prev => [
          { 
            attendee: result.attendee!, 
            timestamp: new Date().toISOString(),
            success: result.success 
          },
          ...prev.slice(0, 9) // Keep only the 10 most recent scans
        ]);
      }
      
      // Show toast notification
      if (result.success) {
        toast({
          title: "Check-in Successful",
          description: `${result.attendee?.name || 'Attendee'} has been checked in.`,
        });
      } else {
        toast({
          title: "Check-in Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error scanning ticket:', error);
      setScanResult({
        success: false,
        message: error.message || "Failed to process ticket"
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to process ticket scan",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Validating Scanner Link</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="animate-pulse">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">Invalid Scanner Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">This scanner link is invalid or has expired.</p>
            <div className="flex justify-center">
              <Button variant="secondary" onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-5 w-5" />
            Event Check-In Scanner
          </CardTitle>
          <p className="text-center text-muted-foreground">
            {eventName}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <QrCodeScanner onScan={handleScan} />
          
          {recentScans.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Recent Scans</h3>
              <div className="max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {recentScans.map((scan, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded text-sm ${
                        scan.success 
                          ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-900'
                          : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900'
                      }`}
                    >
                      <div className="font-medium">{scan.attendee.name || 'Unknown attendee'}</div>
                      <div className="text-xs flex justify-between">
                        <span>{scan.success ? 'Checked in' : 'Failed'}</span>
                        <span>{new Date(scan.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventScannerPage;
