
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SwigCircuitTicket } from '@/types/TicketTypes';

interface SwigCircuitTicketCardProps {
  ticket: SwigCircuitTicket;
  onShowQR: (code: string, name: string, details: string) => void;
}

const SwigCircuitTicketCard: React.FC<SwigCircuitTicketCardProps> = ({ ticket, onShowQR }) => {
  const swigCircuit = ticket.swig_circuit || {};
  const hasCircuitDate = swigCircuit && 'date' in swigCircuit && swigCircuit.date;
  const circuitDate = hasCircuitDate 
    ? new Date(swigCircuit.date as string).toLocaleDateString() 
    : ticket.purchase_date 
      ? new Date(ticket.purchase_date).toLocaleDateString() 
      : 'No date';
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">
        {swigCircuit && 'name' in swigCircuit && swigCircuit.name ? String(swigCircuit.name) : 'Swig Circuit'}
      </h3>
      <div className="text-sm text-muted-foreground space-y-1 mt-2">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{circuitDate}</span>
        </div>
        {swigCircuit && 'time' in swigCircuit && swigCircuit.time && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{String(swigCircuit.time)}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-medium">
          {(ticket.ticket_tier && ticket.ticket_tier.name) || 'Standard Ticket'}
        </span>
        <Button 
          size="sm" 
          onClick={() => onShowQR(
            String(ticket.ticket_code || ticket.id),
            (swigCircuit && 'name' in swigCircuit && swigCircuit.name) ? String(swigCircuit.name) : 'Swig Circuit',
            `Swig Circuit Pass`
          )}
        >
          Show QR Code
        </Button>
      </div>
    </div>
  );
};

export default SwigCircuitTicketCard;
