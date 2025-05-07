
import React from 'react';
import Layout from '@/components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

// Create local events query hook
const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .order('date', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });
};

const EventsPage = () => {
  const { data: events, isLoading, error } = useEvents();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
        
        {isLoading ? (
          <div>Loading events...</div>
        ) : error ? (
          <div>Error loading events</div>
        ) : events.length === 0 ? (
          <div>No upcoming events found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold">{event.name}</h2>
                  <p className="text-gray-500">{event.date}</p>
                  <p className="mt-2">{event.description || 'No description available'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
