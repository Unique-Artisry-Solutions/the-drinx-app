
import React from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventTicket } from '@/types/TicketTypes';

interface EventTicketCardProps {
  ticket: EventTicket;
  onShowQR: (code: string, name: string, details: string) => void;
}

const EventTicketCard: React.FC<EventTicketCardProps> = ({ ticket, onShowQR }) => {
  return (
    <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">{ticket.event.name}</h3>
      <div className="text-sm text-muted-foreground space-y-1 mt-2">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(ticket.event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{ticket.event.time}</span>
        </div>
        {ticket.event.venue && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{ticket.event.venue.name}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-medium">{ticket.ticket_type ? ticket.ticket_type.name : 'General Admission'}</span>
        <Button 
          size="sm" 
          onClick={() => onShowQR(
            ticket.ticket_code || '',
            ticket.event.name,
            `${new Date(ticket.event.date).toLocaleDateString()} at ${ticket.event.time}`
          )}
        >
          Show QR Code
        </Button>
      </div>
    </div>
  );
};

export default EventTicketCard;
