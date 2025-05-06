
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventAttendee } from '@/types/EventTypes';
import { 
  User, Mail, Calendar, Ticket, 
  ClipboardCheck, Clock, Tag, MessageSquare
} from 'lucide-react';

interface AttendeeDetailViewProps {
  attendee: EventAttendee | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (attendeeId: string) => void;
  onCancel: (attendeeId: string) => void;
  onAddNote: (attendeeId: string, note: string) => void;
}

const AttendeeDetailView: React.FC<AttendeeDetailViewProps> = ({
  attendee,
  isOpen,
  onClose,
  onCheckIn,
  onCancel,
  onAddNote
}) => {
  const [note, setNote] = React.useState('');

  const handleAddNote = () => {
    if (attendee?.id && note.trim()) {
      onAddNote(attendee.id, note);
      setNote('');
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Registered</Badge>;
      case 'checked_in':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Checked In</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'no_show':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!attendee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attendee Details</DialogTitle>
          <DialogDescription>
            View and manage attendee information
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="text-lg font-semibold">{attendee.name}</h3>
            <p className="text-sm text-gray-500">{attendee.email}</p>
          </div>
          <div>{renderStatusBadge(attendee.status)}</div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="ticket">Ticket</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Name:</span>
                <span>{attendee.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Email:</span>
                <span>{attendee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Purchase Date:</span>
                <span>{new Date(attendee.purchase_date).toLocaleString()}</span>
              </div>
              {attendee.checked_in_at && (
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Checked In:</span>
                  <span>{new Date(attendee.checked_in_at).toLocaleString()}</span>
                </div>
              )}
              
              {/* Custom fields section */}
              {attendee.custom_fields && Object.keys(attendee.custom_fields).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2">Custom Information</h4>
                  <div className="space-y-2">
                    {Object.entries(attendee.custom_fields).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{key}:</span>
                        <span>{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ticket" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Ticket Code:</span>
                <span className="font-mono">{attendee.ticket_code}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Ticket Type ID:</span>
                <span>{attendee.ticket_type_id || 'Standard'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Status:</span>
                {renderStatusBadge(attendee.status)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {attendee.status === 'registered' && (
                <Button 
                  variant="default" 
                  className="gap-2"
                  onClick={() => attendee.id && onCheckIn(attendee.id)}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Check In
                </Button>
              )}
              {(attendee.status === 'registered' || attendee.status === 'checked_in') && (
                <Button 
                  variant="destructive" 
                  className="gap-2"
                  onClick={() => attendee.id && onCancel(attendee.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Cancel Registration
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 pt-4">
            <div className="space-y-3">
              {attendee.notes ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{attendee.notes}</p>
                </div>
              ) : (
                <p className="text-gray-500">No notes for this attendee yet.</p>
              )}

              <div className="mt-4">
                <textarea
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  placeholder="Add a note about this attendee..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <Button 
                  className="mt-2 gap-2" 
                  onClick={handleAddNote}
                  disabled={!note.trim()}
                >
                  <MessageSquare className="h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeeDetailView;
