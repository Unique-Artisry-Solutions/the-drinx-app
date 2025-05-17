
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter
} from '@/components/ui/card';
import QRCode from '@/components/ui/qrcode';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { SwigCircuitTicket } from '@/types/TicketTypes';

export interface SwigCircuitTicketCardProps {
  ticket: SwigCircuitTicket;
  onShowQR?: (code: string, name: string, details: string) => void;
}

const SwigCircuitTicketCard: React.FC<SwigCircuitTicketCardProps> = ({ 
  ticket,
  onShowQR
}) => {
  const handleShowQR = () => {
    if (onShowQR && ticket.ticket_code) {
      const ticketDetails = `Ticket Type: ${ticket.ticket_tier?.name || 'Standard'}`;
      onShowQR(ticket.ticket_code, `Swig Circuit Ticket`, ticketDetails);
    }
  };

  // Determine venue name from ticket data
  const venueName = ticket.venue_name || 'Multiple Venues';

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Swig Circuit Ticket</CardTitle>
        <CardDescription>
          Purchased on {ticket.purchase_date ? format(new Date(ticket.purchase_date), 'MMM d, yyyy') : 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Location: {venueName}</p>
          <div className="mt-4">
            {ticket.ticket_code ? (
              <div className="flex justify-center">
                <QRCode value={ticket.ticket_code} size={120} />
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">No ticket code available</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleShowQR} disabled={!ticket.ticket_code}>
          View Full QR Code
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SwigCircuitTicketCard;
