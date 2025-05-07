
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { EventAttendee } from '@/types/EventTypes';
import { Check, WifiOff, CloudOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OfflineCheckInProps {
  eventId: string;
  attendees: EventAttendee[];
  onCheckIn: (attendeeId: string) => Promise<void>;
}

interface OfflineCheckInRecord {
  attendeeId: string;
  ticketCode: string;
  name: string;
  timestamp: string;
  synced: boolean;
}

const OfflineCheckIn: React.FC<OfflineCheckInProps> = ({ eventId, attendees, onCheckIn }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineRecords, setOfflineRecords] = useLocalStorage<OfflineCheckInRecord[]>(`offline-checkins-${eventId}`, []);
  const [ticketCode, setTicketCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleCheckIn = async () => {
    if (!ticketCode.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Find the attendee with this ticket code
      const attendee = attendees.find(a => a.ticket_code?.toLowerCase() === ticketCode.toLowerCase());
      
      if (!attendee) {
        toast({
          title: "Ticket Not Found",
          description: "No attendee found with this ticket code",
          variant: "destructive",
        });
        return;
      }
      
      if (attendee.status === 'checked_in') {
        toast({
          title: "Already Checked In",
          description: "This attendee has already been checked in",
          variant: "destructive",
        });
        return;
      }
      
      if (isOnline) {
        // Online mode - check in directly
        await onCheckIn(attendee.id!);
        toast({
          title: "Check-in Successful",
          description: `${attendee.name || 'Attendee'} has been checked in`,
        });
      } else {
        // Offline mode - store check-in locally
        const newRecord: OfflineCheckInRecord = {
          attendeeId: attendee.id!,
          ticketCode: attendee.ticket_code || '',
          name: attendee.name || 'Unknown Attendee',
          timestamp: new Date().toISOString(),
          synced: false
        };
        
        setOfflineRecords([...offlineRecords, newRecord]);
        toast({
          title: "Offline Check-in Recorded",
          description: `${attendee.name || 'Attendee'} will be checked in when back online`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process check-in",
        variant: "destructive",
      });
    } finally {
      setTicketCode('');
      setIsProcessing(false);
    }
  };
  
  const syncOfflineCheckIns = async () => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Please connect to the internet to sync check-ins",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    const updatedRecords = [...offlineRecords];
    let successCount = 0;
    
    for (let i = 0; i < updatedRecords.length; i++) {
      if (!updatedRecords[i].synced) {
        try {
          await onCheckIn(updatedRecords[i].attendeeId);
          updatedRecords[i].synced = true;
          successCount++;
        } catch (error) {
          console.error("Failed to sync check-in:", updatedRecords[i]);
        }
      }
    }
    
    setOfflineRecords(updatedRecords);
    setIsProcessing(false);
    
    toast({
      title: "Sync Complete",
      description: `${successCount} offline check-ins have been synchronized`,
    });
  };

  // Filter for unsynced records
  const pendingRecords = offlineRecords.filter(record => !record.synced);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {isOnline ? 'Manual Check-in' : <><WifiOff className="h-4 w-4" /> Offline Mode</>}
            </CardTitle>
            <Badge variant={isOnline ? "default" : "outline"} className={isOnline ? "bg-green-500" : ""}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter ticket code" 
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleCheckIn} 
                disabled={isProcessing || !ticketCode.trim()}
              >
                Check In
              </Button>
            </div>
            
            {pendingRecords.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-1">
                    <CloudOff className="h-4 w-4" /> 
                    Pending Offline Check-ins
                  </h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!isOnline || isProcessing} 
                    onClick={syncOfflineCheckIns}
                  >
                    Sync Now
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  <div className="divide-y">
                    {pendingRecords.map((record, index) => (
                      <div key={index} className="p-2 text-sm flex justify-between items-center">
                        <span className="font-medium">{record.name}</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineCheckIn;
