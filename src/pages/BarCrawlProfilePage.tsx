
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';
import BarCrawlProfileHeader from '@/components/barCrawl/profile/BarCrawlProfileHeader';
import RouteTabContent from '@/components/barCrawl/profile/RouteTabContent';
import MapTabContent from '@/components/barCrawl/profile/MapTabContent';
import DetailsTabContent from '@/components/barCrawl/profile/DetailsTabContent';
import BackButton from '@/components/navigation/BackButton';

interface BarCrawlProfileProps {}

const BarCrawlProfilePage: React.FC<BarCrawlProfileProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [barCrawl, setBarCrawl] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [activeStop, setActiveStop] = useState<number>(0);

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

          // Generate sample participants
          setParticipants([
            {
              id: '1',
              name: 'Alex Johnson',
              avatar: '/placeholder.svg',
              isActive: true,
              role: 'Organizer'
            },
            {
              id: '2',
              name: 'Jamie Smith',
              avatar: '/placeholder.svg',
              isActive: true
            },
            {
              id: '3',
              name: 'Casey Wilson',
              avatar: '/placeholder.svg',
              isActive: true
            }
          ]);
        }
        
        setLoading(false);
      }, 500);
    };
    
    fetchBarCrawl();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="py-4 animate-fade-in max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!barCrawl) {
    return (
      <Layout>
        <div className="py-4 animate-fade-in max-w-6xl mx-auto">
          <BackButton fallbackPath="/profile/bar-crawls" />
          <h1 className="text-2xl font-bold mb-2">Bar Crawl Not Found</h1>
          <p className="mb-4 text-gray-600">
            The bar crawl you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild variant="default">
            <Link to="/profile/bar-crawls">
              Back to Bar Crawls
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Prepare map data
  const mapEstablishments = barCrawl.establishments.map((establishment: any) => ({
    id: establishment.id,
    name: establishment.name,
    latitude: establishment.latitude,
    longitude: establishment.longitude,
    cocktailCount: establishment.cocktailCount
  }));

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-6xl mx-auto">
        <BackButton fallbackPath="/profile/bar-crawls" />
        
        <BarCrawlProfileHeader 
          name={barCrawl.name}
          participants={participants.length}
          date={barCrawl.date}
          stops={barCrawl.stops}
          id={id || ''}
        />

        <Tabs defaultValue="route" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="route">Crawl Route</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="route">
            <RouteTabContent 
              establishments={barCrawl.establishments}
              participants={participants}
              activeStop={activeStop}
              id={id || ''}
            />
          </TabsContent>
          
          <TabsContent value="map">
            <MapTabContent establishments={mapEstablishments} />
          </TabsContent>
          
          <TabsContent value="details">
            <DetailsTabContent 
              organizer={barCrawl.organizer}
              date={barCrawl.date}
              stops={barCrawl.stops}
              description={barCrawl.description || "Join us for a fun night exploring the best alcohol-free establishments in the area. Enjoy special mocktails, meet new people, and experience the nightlife without the hangover!"}
              participants={participants}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BarCrawlProfilePage;
