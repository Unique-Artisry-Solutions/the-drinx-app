
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Route, Calendar, Users, Clock, MapPin } from 'lucide-react';
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
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
      <div className="py-4 animate-fade-in max-w-7xl mx-auto">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{barCrawl.name}</h1>
              <div className="flex flex-wrap gap-3 text-gray-600">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1">
              {barCrawl.establishments.map((establishment, index) => (
                <div key={establishment.id} className="flex items-center py-1">
                  <div className="flex items-center justify-center bg-spiritless-pink text-white rounded-full h-6 w-6 text-sm mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <Link to={`/establishment/${establishment.id}`} className="text-material-primary hover:underline truncate">
                    {establishment.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-3">Establishments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {barCrawl.establishments.map((establishment) => (
            <Card key={establishment.id} className="overflow-hidden hover:shadow-md transition-shadow h-full">
              <Link to={`/establishment/${establishment.id}`} className="flex flex-col h-full">
                <div className="h-32 bg-gray-200 relative">
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
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base mb-1 line-clamp-1">{establishment.name}</h3>
                  <p className="text-gray-600 text-xs flex items-start mb-2">
                    <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{establishment.address}</span>
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 text-xs text-gray-500">
                    <span>
                      {establishment.cocktailCount || 0} cocktails
                    </span>
                    {establishment.distance && (
                      <span>{establishment.distance} away</span>
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
