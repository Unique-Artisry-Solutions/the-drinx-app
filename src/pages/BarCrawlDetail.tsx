import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Route, Calendar, Users, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';

interface BarCrawlEstablishment {
  id: string;
  name: string;
  address: string;
  distance?: string;
  cocktailCount?: number;
  image?: string;
  phone?: string;
  website?: string;
  hours?: string[];
  latitude: number;
  longitude: number;
}

interface BarCrawl {
  id: string;
  name: string;
  stops: number;
  organizer: string;
  date: string;
  establishments: BarCrawlEstablishment[];
  description?: string;
}

const BarCrawlDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [barCrawl, setBarCrawl] = useState<BarCrawl | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBarCrawl = () => {
      setTimeout(() => {
        const crawl = sampleBarCrawls.find(c => c.id === id);
        
        if (crawl) {
          const establishments = sampleEstablishments.slice(0, crawl.stops);
          
          setBarCrawl({
            ...crawl,
            date: crawl.date || new Date().toISOString().split('T')[0],
            establishments
          });
        }
        
        setLoading(false);
      }, 1000);
    };
    
    fetchBarCrawl();
  }, [id]);

  const handleJoin = () => {
    toast({
      title: "Successfully joined!",
      description: "You've been added to this bar crawl"
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-4 animate-fade-in">
          <Skeleton className="h-12 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!barCrawl) {
    return (
      <Layout>
        <div className="py-4 animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">Bar Crawl Not Found</h1>
          <p className="mb-4 text-gray-600">
            The bar crawl you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild variant="default">
            <Link to="/explore">
              Explore Bar Crawls
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{barCrawl.name}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Organizer: {barCrawl.organizer}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Date: {barCrawl.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{barCrawl.stops} stops</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleJoin}
              className="bg-spiritless-pink hover:bg-spiritless-pink/90 text-white"
            >
              Join Bar Crawl
            </Button>
          </div>
          
          {barCrawl.description && (
            <p className="text-gray-700 mb-4">{barCrawl.description}</p>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <Route className="h-5 w-5 mr-2 text-spiritless-pink" />
              Crawl Route
            </h2>
            <div className="space-y-1">
              {barCrawl.establishments.map((establishment, index) => (
                <div key={establishment.id} className="flex items-center">
                  <div className="flex items-center justify-center bg-spiritless-pink text-white rounded-full h-6 w-6 text-sm mr-3">
                    {index + 1}
                  </div>
                  <Link to={`/establishment/${establishment.id}`} className="text-material-primary hover:underline">
                    {establishment.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Establishments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {barCrawl.establishments.map((establishment) => (
            <Card key={establishment.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/establishment/${establishment.id}`}>
                <div className="h-40 bg-gray-200 relative">
                  {establishment.image ? (
                    <img 
                      src={establishment.image} 
                      alt={establishment.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No image available
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{establishment.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{establishment.address}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {establishment.cocktailCount || 0} cocktails
                    </span>
                    {establishment.distance && (
                      <span className="text-sm text-gray-500">{establishment.distance} away</span>
                    )}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BarCrawlDetail;
