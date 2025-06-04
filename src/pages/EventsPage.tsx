import React from 'react';
import { Layout } from '@/components/Layout';
import EventsList from '@/components/events/EventsList';

const EventsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
        <EventsList />
      </div>
    </Layout>
  );
};

export default EventsPage;
