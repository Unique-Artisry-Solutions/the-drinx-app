
import React, { useState, useEffect } from 'react';
import { useEventAttendees } from '@/hooks/events/useEventAttendees';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { QrCode, Users, WifiOff, ChartBar } from 'lucide-react';
import CheckInScanner from './CheckInScanner';
import OfflineCheckIn from './OfflineCheckIn';
import GuestListManagement from './GuestListManagement';
import CheckInAnalytics from './CheckInAnalytics';
import { generateEventAccessToken } from '@/services/eventAccessService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface CheckInTabContentProps {
  eventId: string;
  eventName: string;
}

const CheckInTabContent: React.FC<CheckInTabContentProps> = ({ eventId, eventName }) => {
  const [activeTab, setActiveTab] = useState('scanner');
  const { attendees, refresh, checkIn } = useEventAttendees(eventId);
  const [scannerLink, setScannerLink] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const { toast } = useToast();

  // Generate a scanner link that can be used on other devices
  const generateScannerLink = async () => {
    try {
      setIsGeneratingLink(true);
      const token = await generateEventAccessToken(eventId);
      const scanLink = `${window.location.origin}/events/scanner/${eventId}/${token}`;
      setScannerLink(scanLink);
      setShowLinkDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate scanner link",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scannerLink);
    toast({
      title: "Link Copied",
      description: "Scanner link copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Event Check-in</span>
            <Button 
              onClick={generateScannerLink} 
              disabled={isGeneratingLink}
              size="sm"
              className="ml-auto"
            >
              {isGeneratingLink ? "Generating..." : "Generate Scanner Link"}
            </Button>
          </CardTitle>
          <CardDescription>
            Check in attendees for {eventName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scanner" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <span className="hidden sm:inline">Scanner</span>
              </TabsTrigger>
              <TabsTrigger value="offline" className="flex items-center gap-2">
                <WifiOff className="h-4 w-4" />
                <span className="hidden sm:inline">Offline</span>
              </TabsTrigger>
              <TabsTrigger value="guestlist" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Guest List</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner">
              <CheckInScanner 
                eventId={eventId} 
                onCheckIn={(attendeeId) => checkIn(attendeeId)}
                onSuccess={() => refresh()}
              />
            </TabsContent>

            <TabsContent value="offline">
              <OfflineCheckIn 
                eventId={eventId} 
                attendees={attendees}
                onCheckIn={(attendeeId) => checkIn(attendeeId)} 
              />
            </TabsContent>

            <TabsContent value="guestlist">
              <GuestListManagement 
                eventId={eventId} 
                attendees={attendees}
                onCheckIn={(attendeeId) => checkIn(attendeeId)} 
              />
            </TabsContent>

            <TabsContent value="analytics">
              <CheckInAnalytics eventId={eventId} attendees={attendees} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Scanner Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scanner Link Generated</DialogTitle>
            <DialogDescription>
              Use this link to open the check-in scanner on other devices. The link is valid for 30 days.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={scannerLink} readOnly className="flex-1" />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
          <div className="my-2 text-sm text-muted-foreground">
            <p>You can share this link with staff members who will be checking in attendees at the event.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowLinkDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckInTabContent;
