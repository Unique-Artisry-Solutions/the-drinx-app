
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EventAttendee } from '@/types/EventTypes';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface AttendeeDetailModalProps {
  attendee: EventAttendee | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (attendeeId: string) => Promise<void>;
}

const AttendeeDetailModal: React.FC<AttendeeDetailModalProps> = ({
  attendee,
  isOpen,
  onClose,
  onCheckIn
}) => {
  const { toast } = useToast();
  const [isCheckinIn, setIsCheckinIn] = React.useState(false);

  if (!attendee) return null;

  const handleCheckIn = async () => {
    if (!attendee.id) return;
    
    setIsCheckinIn(true);
    try {
      await onCheckIn(attendee.id);
      toast({
        title: "Success",
        description: "Attendee checked in successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in attendee",
        variant: "destructive"
      });
    } finally {
      setIsCheckinIn(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attendee Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center justify-center mb-4">
            {attendee.ticket_code && (
              <div className="mb-4 p-2 bg-white rounded-md">
                <QRCode
                  value={attendee.ticket_code}
                  size={150}
                />
              </div>
            )}
            <Badge className={
              attendee.status === 'checked_in' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              attendee.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            }>
              {attendee.status}
            </Badge>
          </div>

          <Separator />
          
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Name:</div>
            <div>{attendee.name || 'N/A'}</div>
            
            <div className="font-medium">Email:</div>
            <div>{attendee.email || 'N/A'}</div>
            
            <div className="font-medium">Ticket Code:</div>
            <div className="font-mono">{attendee.ticket_code || 'N/A'}</div>
            
            <div className="font-medium">Purchase Date:</div>
            <div>
              {attendee.purchase_date ? 
                format(new Date(attendee.purchase_date), 'MMM d, yyyy') : 
                'N/A'}
            </div>
            
            {attendee.checked_in_at && (
              <>
                <div className="font-medium">Checked In:</div>
                <div>{format(new Date(attendee.checked_in_at), 'MMM d, yyyy h:mm a')}</div>
              </>
            )}
            
            {attendee.notes && (
              <>
                <div className="font-medium">Notes:</div>
                <div>{attendee.notes}</div>
              </>
            )}
          </div>
          
          {attendee.custom_fields && Object.keys(attendee.custom_fields).length > 0 && (
            <>
              <Separator />
              <h4 className="font-medium">Custom Fields</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(attendee.custom_fields).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <div className="font-medium">{key}:</div>
                    <div>{String(value)}</div>
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {attendee.status !== 'checked_in' && attendee.status !== 'cancelled' && (
            <Button 
              onClick={handleCheckIn} 
              disabled={isCheckinIn}
            >
              {isCheckinIn ? 'Checking in...' : 'Check In'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeeDetailModal;
