
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EventsList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sample Event</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the events list component.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsList;
