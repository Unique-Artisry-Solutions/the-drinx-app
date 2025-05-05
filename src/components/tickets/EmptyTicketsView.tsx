
import React from 'react';
import { Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTicketsViewProps {
  type: 'event' | 'swig';
}

const EmptyTicketsView: React.FC<EmptyTicketsViewProps> = ({ type }) => {
  const isEvent = type === 'event';
  
  return (
    <div className="text-center py-12">
      <Ticket className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium">
        {isEvent ? 'No Event Tickets' : 'No Swig Circuit Tickets'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {isEvent 
          ? 'You haven\'t purchased any event tickets yet.'
          : 'You haven\'t purchased any Swig Circuit tickets yet.'
        }
      </p>
      <Button className="mt-4" asChild>
        <a href={isEvent ? '/events' : '/swig-circuits'}>
          {isEvent ? 'Browse Events' : 'Browse Swig Circuits'}
        </a>
      </Button>
    </div>
  );
};

export default EmptyTicketsView;
