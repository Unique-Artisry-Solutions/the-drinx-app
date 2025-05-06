
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { EventStatus } from '@/types/EventTypes';

interface EventFooterProps {
  status: EventStatus | undefined;
  onStatusUpdate: (status: EventStatus) => void;
}

const EventFooter: React.FC<EventFooterProps> = ({ status, onStatusUpdate }) => {
  return (
    <CardFooter>
      <div className="w-full flex justify-end">
        {status === 'draft' && (
          <Button onClick={() => onStatusUpdate('published')}>
            Publish Event <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        {status === 'published' && (
          <Button onClick={() => onStatusUpdate('completed')}>
            Mark as Completed <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </CardFooter>
  );
};

export default EventFooter;
