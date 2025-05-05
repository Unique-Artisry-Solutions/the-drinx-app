
import React from 'react';
import { EventTicket, SwigCircuitTicket } from '@/types/TicketTypes';
import EventTicketCard from './EventTicketCard';
import SwigCircuitTicketCard from './SwigCircuitTicketCard';
import TicketSkeleton from './TicketSkeleton';
import EmptyTicketsView from './EmptyTicketsView';

interface TicketsTabContentProps {
  type: 'event' | 'swig';
  tickets: EventTicket[] | SwigCircuitTicket[];
  isLoading: boolean;
  onShowQR: (code: string, name: string, details: string) => void;
}

const TicketsTabContent: React.FC<TicketsTabContentProps> = ({ 
  type, 
  tickets, 
  isLoading, 
  onShowQR 
}) => {
  if (isLoading) {
    return <TicketSkeleton />;
  }

  if (!tickets || tickets.length === 0) {
    return <EmptyTicketsView type={type} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {type === 'event' ? (
        (tickets as EventTicket[]).map((ticket: EventTicket) => (
          <EventTicketCard
            key={ticket.id}
            ticket={ticket}
            onShowQR={onShowQR}
          />
        ))
      ) : (
        (tickets as SwigCircuitTicket[]).map((ticket: SwigCircuitTicket) => (
          <SwigCircuitTicketCard
            key={ticket.id}
            ticket={ticket}
            onShowQR={onShowQR}
          />
        ))
      )}
    </div>
  );
};

export default TicketsTabContent;
