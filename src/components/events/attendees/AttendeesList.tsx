
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventAttendee } from '@/types/EventTypes';
import { Eye, CheckCircle, X, AlertTriangle, Clock } from 'lucide-react';

interface AttendeesListProps {
  attendees: EventAttendee[];
  isLoading: boolean;
  onViewDetails: (attendeeId: string) => void;
  onCheckIn: (attendeeId: string) => void;
}

const AttendeesList: React.FC<AttendeesListProps> = ({
  attendees,
  isLoading,
  onViewDetails,
  onCheckIn
}) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendees</CardTitle>
        <CardDescription>
          Manage your event attendees
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : attendees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No attendees found for this event.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{attendee.ticket_type?.name || 'Standard'}</TableCell>
                    <TableCell>{renderStatusBadge(attendee.status)}</TableCell>
                    <TableCell>{new Date(attendee.purchase_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => onViewDetails(attendee.id!)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        {attendee.status === 'registered' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            onClick={() => onCheckIn(attendee.id!)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Check in</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendeesList;
