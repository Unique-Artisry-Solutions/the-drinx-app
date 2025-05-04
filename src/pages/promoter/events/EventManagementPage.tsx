
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventCard from '@/components/promoter/events/EventCard';
import { useEvents, LocationFilter } from '@/hooks/events/useEvents';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const EventManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { events, isLoading, fetchEvents } = useEvents();
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [radiusMiles, setRadiusMiles] = useState<number>(10);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  
  // Filter events based on search term and active tab
  const filteredEvents = events.filter(event => {
    const eventName = event.name?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = eventName.includes(searchLower);
                        
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && event.status === activeTab;
  });

  // Handle tab changes to fetch appropriate events
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Apply status filter based on tab
    const statusFilter = value !== 'all' ? value : undefined;
    
    // If we have a location filter active, pass it along
    if (userLocation) {
      const locationFilter: LocationFilter = {
        ...userLocation,
        radiusMiles: radiusMiles
      };
      fetchEvents(locationFilter, statusFilter);
    } else {
      fetchEvents(undefined, statusFilter);
    }
  };

  // Get user location and filter events
  const handleLocationFilter = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          // Apply location filter
          const locationFilter: LocationFilter = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radiusMiles: radiusMiles
          };
          
          // Pass current tab status if not 'all'
          const statusFilter = activeTab !== 'all' ? activeTab : undefined;
          fetchEvents(locationFilter, statusFilter);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not get your location. Please check permissions.",
            variant: "destructive",
          });
          setIsLocating(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      setIsLocating(false);
    }
  };

  // Apply radius filter when radius changes and we have user location
  useEffect(() => {
    if (userLocation) {
      const locationFilter: LocationFilter = {
        ...userLocation,
        radiusMiles: radiusMiles
      };
      // Pass current tab status if not 'all'
      const statusFilter = activeTab !== 'all' ? activeTab : undefined;
      fetchEvents(locationFilter, statusFilter);
    }
  }, [radiusMiles, userLocation, fetchEvents, activeTab]);

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
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowLocationFilter(!showLocationFilter)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
          
          {showLocationFilter && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Location Filter
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Find events near you</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleLocationFilter}
                  disabled={isLocating}
                >
                  {isLocating ? "Locating..." : userLocation ? "Update Location" : "Use My Location"}
                </Button>
              </div>
              
              {userLocation && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Radius: {radiusMiles} miles</span>
                    </div>
                    <Slider
                      value={[radiusMiles]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setRadiusMiles(value[0])}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="published">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="completed">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="pt-2">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded w-48 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded max-w-sm mx-auto"></div>
                  </div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map(event => (
                    <EventCard 
                      key={event.id}
                      id={event.id}
                      name={event.name}
                      date={event.date}
                      time={event.time}
                      venue={event.venue_id ? "View event for venue details" : "Venue not specified"}
                      attendeeCount={0}
                      status={event.status}
                      imageUrl={event.image_url}
                      distance={event.distance}
                    />
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
