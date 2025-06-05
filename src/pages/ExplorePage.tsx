
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Star } from 'lucide-react';

const ExplorePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Search className="h-8 w-8 text-primary" />
            Explore
          </h1>
          <p className="text-muted-foreground">Discover amazing non-alcoholic cocktails and venues near you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Venues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover establishments serving craft mocktails in your area
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Rated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse the highest rated mocktails and cocktails
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join bar crawls and mocktail tasting events
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage;
