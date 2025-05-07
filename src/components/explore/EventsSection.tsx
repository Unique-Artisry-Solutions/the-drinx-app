
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EventCard from './EventCard';
import { Skeleton } from '@/components/ui/skeleton';

const useEvents = (limit: number = 6) => {
  return useQuery({
    queryKey: ['featuredEvents', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }
  });
};

const EventsSection = () => {
  const { data: events, isLoading, error } = useEvents();

  if (error) {
    console.error('Error loading events:', error);
  }

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))
          ) : events?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl">No upcoming events found.</p>
              <p className="text-gray-500 mt-2">Check back soon for new events!</p>
            </div>
          ) : (
            events?.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                description={event.description || ''}
                date={event.date}
                imageUrl={event.image_url}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
