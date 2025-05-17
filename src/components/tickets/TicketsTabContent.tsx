
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket, QrCode } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SwigCircuitTicket } from '@/types/TicketTypes';
import SwigCircuitTicketCard from './SwigCircuitTicketCard';
import EventTicketCard from './EventTicketCard';
import TicketSkeleton from './TicketSkeleton';

interface TicketsTabContentProps {
  type: 'event' | 'swig';
  tickets: any[];
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
    return (
      <div className="space-y-4">
        <TicketSkeleton />
        <TicketSkeleton />
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {type === 'event' ? (
          <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
        ) : (
          <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
        )}
        <h3 className="text-lg font-medium">No {type === 'event' ? 'event tickets' : 'swig circuit passes'} found</h3>
        <p className="text-muted-foreground mt-2">
          When you purchase tickets, they will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {type === 'event'
        ? tickets.map(ticket => (
            <EventTicketCard key={ticket.id} ticket={ticket} onShowQR={onShowQR} />
          ))
        : tickets.map((ticket: SwigCircuitTicket) => (
            <SwigCircuitTicketCard key={ticket.id} ticket={ticket} onShowQR={onShowQR} />
          ))
      }
    </div>
  );
};

export default TicketsTabContent;
