
import React from 'react';
import { SearchIcon, MapPin, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import RewardsHighlightWidget from '../rewards/RewardsHighlightWidget';
import ActionableEstablishmentCard from '../establishments/ActionableEstablishmentCard';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

/**
 * An enhanced explore section with improved rewards visibility and establishment discovery
 */
export const EnhancedExploreSection = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');
  
  // Mock establishments data
  const establishments = [
    {
      id: '1',
      name: 'The Spiritless Lounge',
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80',
      rating: 4.8,
      distance: '0.3 mi',
      address: '123 Main St, San Francisco, CA',
      isOpen: true,
      highestRatedDrink: {
        name: 'Virgin Mojito',
        rating: 4.9
      }
    },
    {
      id: '2',
      name: 'Zero Proof Bar & Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80',
      rating: 4.5,
      distance: '1.2 mi',
      address: '456 Market St, San Francisco, CA',
      isOpen: true,
      highestRatedDrink: {
        name: 'Cucumber Cooler',
        rating: 4.7
      }
    },
    {
      id: '3',
      name: 'Sober Social Club',
      imageUrl: 'https://images.unsplash.com/photo-1529604278261-8bfcbc8a3b61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80',
      rating: 4.9,
      distance: '0.8 mi',
      address: '789 Howard St, San Francisco, CA',
      isOpen: false,
      openingTime: '5:00 PM',
      highestRatedDrink: {
        name: 'Berry Blast',
        rating: 4.8
      }
    }
  ];
  
  const handleCheckIn = (establishmentId: string, establishmentName: string) => {
    toast.success(`Checked in at ${establishmentName}`, {
      description: "You've earned 10 points!"
    });
    // In a real implementation, this would call an API to check in
  };
  
  const handleAddToSwigCircuit = (establishmentId: string, establishmentName: string) => {
    toast.success(`Added to Bar Crawl`, {
      description: `${establishmentName} has been added to your bar crawl`
    });
    // In a real implementation, this would add to the bar crawl state
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would filter establishments
    toast.info(`Searching for "${searchQuery}"`);
  };
  
  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Only show rewards for authenticated users */}
      {user && <RewardsHighlightWidget />}
      
      {/* Search and filter section */}
      <Card className="mb-6 p-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bars, mocktails, or events..."
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        <div className="flex items-center justify-between">
          <Tabs value={activeFilter} onValueChange={handleFilterChange} className="w-[400px]">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="bars">Bars</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="mocktails">Mocktails</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>
      
      {/* Content based on active filter */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Popular Bars Near You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {establishments.map(establishment => (
            <ActionableEstablishmentCard
              key={establishment.id}
              id={establishment.id}
              name={establishment.name}
              imageUrl={establishment.imageUrl}
              rating={establishment.rating}
              distance={establishment.distance}
              address={establishment.address}
              isOpen={establishment.isOpen}
              openingTime={establishment.openingTime}
              highestRatedDrink={establishment.highestRatedDrink}
              onCheckIn={() => handleCheckIn(establishment.id, establishment.name)}
              onAddToSwigCircuit={() => handleAddToSwigCircuit(establishment.id, establishment.name)}
            />
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" className="w-full max-w-md">
            <MapPin className="h-4 w-4 mr-2" />
            View All Nearby Bars
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedExploreSection;
