
import React from 'react';
import { Button } from '@/components/ui/button';

const NoTicketsView: React.FC = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-muted-foreground mb-4">
        You don't have any tickets yet. Browse our events and Swig Circuits to get started.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild>
          <a href="/events">Browse Events</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/swig-circuits">Explore Swig Circuits</a>
        </Button>
      </div>
    </div>
  );
};

export default NoTicketsView;
