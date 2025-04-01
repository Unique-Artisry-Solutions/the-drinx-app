
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, Navigation, Beer } from 'lucide-react';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BarCrawlDetailsProps {}

const BarCrawlDetailsPage: React.FC<BarCrawlDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [barCrawl, setBarCrawl] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);

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

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{barCrawl.name}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-material-on-surface-variant">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{new Date(barCrawl.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Beer className="mr-1 h-4 w-4" />
              <span>{barCrawl.stops} stops</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{participants.length} participants</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Crawl Details */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-material-on-surface">
                  {barCrawl.description || "Join us for a fun night exploring the best alcohol-free establishments in the area. Enjoy special mocktails, meet new people, and experience the nightlife without the hangover!"}
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Crawl Route</h2>
                <div className="space-y-3">
                  {barCrawl.establishments.map((establishment: any, index: number) => (
                    <div 
                      key={establishment.id} 
                      className="flex p-3 border rounded-lg relative"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-material-primary text-white rounded-full mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="font-medium">{establishment.name}</h4>
                        <div className="flex items-center text-sm text-material-on-surface-variant">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{establishment.address}</span>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/establishment/${establishment.id}`}
                        className="self-center ml-2 text-material-primary text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Participants */}
          <div>
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-3">Participants</h2>
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center p-2 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                        <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-medium">{participant.name}</span>
                        {participant.role && (
                          <Badge className="ml-2 bg-material-primary text-xs">{participant.role}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Link to={`/bar-crawl-profile/${id}`}>
                    <Button className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90">
                      <Navigation className="h-4 w-4 mr-1" />
                      Join This Crawl
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BarCrawlDetailsPage;
