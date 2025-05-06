
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Trash, AlertTriangle, XCircle } from 'lucide-react';
import { useEventService } from '@/hooks/events/useEventService';

interface EventCancellationButtonProps {
  eventId: string;
}

const EventCancellationButton: React.FC<EventCancellationButtonProps> = ({ eventId }) => {
  const { updateStatus, isLoading } = useEventService();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const handleCancelEvent = async () => {
    if (!eventId) return;
    // Here you would typically send the cancellation reason to the backend
    console.log("Cancellation Reason:", cancellationReason);
    const success = await updateStatus(eventId, 'cancelled');
    if (success) {
      setShowConfirmation(false);
      setCancellationReason('');
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowConfirmation(true)}
      >
        <Trash className="h-4 w-4 mr-2" />
        Cancel Event
      </Button>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cancel Event
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reason" className="text-right">
                Reason
              </label>
              <textarea
                id="reason"
                className="col-span-3 rounded-md border border-gray-200 px-2 py-1 shadow-sm focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={handleCancelEvent}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Cancelling...
                  <svg className="ml-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2V4A8 8 0 0 1 20 12H22A10 10 0 0 0 12 2Z" opacity=".5"/>
                    <path fill="currentColor" d="M12 22A10 10 0 0 0 2 12H4A8 8 0 0 1 12 20V22Z"/>
                  </svg>
                </>
              ) : (
                <>
                  Cancel Event
                  <XCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCancellationButton;
