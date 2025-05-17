
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { SwigCircuitTicket } from '@/types/TicketTypes';
import { cn } from '@/lib/utils';
import { QRCode } from '@/components/ui/qrcode';

interface SwigCircuitTicketCardProps {
  ticket: SwigCircuitTicket;
  onViewDetails: (ticketId: string) => void;
}

const SwigCircuitTicketCard: React.FC<SwigCircuitTicketCardProps> = ({ ticket, onViewDetails }) => {
  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card className={cn('overflow-hidden transition-all duration-200',
      ticket.status === 'used' ? 'opacity-70' : '')}>
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-100">Swig Circuit</p>
            <h3 className="text-xl font-bold mt-1">{ticket.ticketType || 'Standard Ticket'}</h3>
          </div>
          {ticket.status && (
            <div className={cn('px-2 py-1 rounded-full text-xs font-medium',
              ticket.status === 'active' ? 'bg-green-400 text-green-900' :
              ticket.status === 'used' ? 'bg-gray-400 text-gray-900' :
              'bg-yellow-400 text-yellow-900'
            )}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{formatDate(ticket.purchaseDate || new Date().toISOString())}</span>
          </div>
          {ticket.swig_circuit_id && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{ticket.venueName || 'Multiple Venues'}</span>
            </div>
          )}
          
          {ticket.ticketCode && (
            <div className="flex justify-center mt-4">
              <QRCode value={ticket.ticketCode} size={120} />
            </div>
          )}
          
          <p className="text-center text-xs text-gray-500 mt-2">
            {ticket.ticketCode || 'No ticket code available'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewDetails(ticket.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SwigCircuitTicketCard;
