
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventCard, { EventCardProps } from '@/components/promoter/events/EventCard';

// Mock data for events
const mockEvents: EventCardProps[] = [
  {
    id: '1',
    name: 'Summer Mocktail Festival',
    date: 'August 15, 2025',
    time: '6:00 PM',
    venue: 'The Purple Lounge',
    attendeeCount: 120,
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1925&q=80'
  },
  {
    id: '2',
    name: 'Mixology Workshop',
    date: 'September 5, 2025',
    time: '7:30 PM',
    venue: 'Skybar',
    attendeeCount: 45,
    status: 'draft'
  },
  {
    id: '3',
    name: 'Rooftop Party',
    date: 'July 22, 2025',
    time: '8:00 PM',
    venue: 'The Rooftop',
    attendeeCount: 85,
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: '4',
    name: 'Weekend Happy Hour',
    date: 'July 10, 2025',
    time: '5:00 PM',
    venue: 'Ocean View',
    attendeeCount: 0,
    status: 'cancelled'
  },
  {
    id: '5',
    name: 'Spring Mix Party',
    date: 'May 5, 2025',
    time: '9:00 PM',
    venue: 'The Purple Lounge',
    attendeeCount: 150,
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  }
];

const EventManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter events based on search term and active tab
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.venue.toLowerCase().includes(searchTerm.toLowerCase());
                        
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && event.status === activeTab;
  });

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">Event Management</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage your events
            </p>
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/promoter/events/create" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Search and filter bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search events..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="published">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="completed">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="pt-2">
              {filteredEvents.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} {...event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {searchTerm 
                      ? "No events found matching your search criteria." 
                      : "No events in this category yet."}
                  </p>
                  <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-700">
                    <Link to="/promoter/events/create">
                      Create your first event
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default EventManagementPage;
