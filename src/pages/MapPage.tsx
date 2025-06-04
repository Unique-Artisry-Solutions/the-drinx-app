
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Navigation, Star } from 'lucide-react';

const MapPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock establishments data
  const establishments = [
    {
      id: '1',
      name: 'The Spiritless Lounge',
      address: '123 Main St, San Francisco, CA',
      rating: 4.8,
      cocktailCount: 45,
      distance: '0.2 miles',
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      name: 'Zero Proof Bar',
      address: '456 Market St, San Francisco, CA',
      rating: 4.6,
      cocktailCount: 38,
      distance: '0.5 miles',
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      name: 'Mocktail Masters',
      address: '789 Union St, San Francisco, CA',
      rating: 4.9,
      cocktailCount: 52,
      distance: '0.8 miles',
      image: '/api/placeholder/300/200'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Nearby Establishments</h1>
          <p className="text-xl text-muted-foreground">
            Discover the best alcohol-free venues in your area
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by location, establishment name, or drink type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
              <Button type="button" variant="outline" size="lg">
                <Navigation className="h-5 w-5 mr-2" />
                Use My Location
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Placeholder */}
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Map View</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-muted-foreground">Map integration coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Establishments List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Nearby Establishments</h2>
            
            {establishments.map((establishment) => (
              <Card key={establishment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={establishment.image}
                      alt={establishment.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{establishment.name}</h3>
                        <Badge variant="secondary">{establishment.distance}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{establishment.rating}</span>
                        <span className="text-muted-foreground">
                          • {establishment.cocktailCount} drinks
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {establishment.address}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">
                          <Navigation className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
