
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { sampleSwigCircuits, sampleEstablishments } from '@/data/sampleData';
import SwigCircuitProfileHeader from '@/components/swigCircuit/profile/SwigCircuitProfileHeader';
import RouteTabContent from '@/components/swigCircuit/profile/RouteTabContent';
import MapTabContent from '@/components/swigCircuit/profile/MapTabContent';
import DetailsTabContent from '@/components/swigCircuit/profile/DetailsTabContent';
import BackButton from '@/components/navigation/BackButton';
import { useToast } from '@/hooks/use-toast';
import { Award, QrCode } from 'lucide-react';

interface SwigCircuitProfileProps {}

const SwigCircuitProfilePage: React.FC<SwigCircuitProfileProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [swigCircuit, setSwigCircuit] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [activeStop, setActiveStop] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSwigCircuit = () => {
      setTimeout(() => {
        const crawl = sampleSwigCircuits.find(c => c.id === id);
        
        if (crawl) {
          const establishments = sampleEstablishments.slice(0, crawl.stops);
          
          setSwigCircuit({
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
              role: 'Organizer',
              badges: ['VIP Crawler', 'Explorer']
            },
            {
              id: '2',
              name: 'Jamie Smith',
              avatar: '/placeholder.svg',
              isActive: true,
              badges: ['First Crawl']
            },
            {
              id: '3',
              name: 'Casey Wilson',
              avatar: '/placeholder.svg',
              isActive: true,
              badges: ['Mocktail Maven', 'Social Butterfly']
            }
          ]);
        }
        
        setLoading(false);
      }, 500);
    };
    
    fetchSwigCircuit();
  }, [id]);

  const markCompleted = () => {
    // In a real app, this would update the user's record
    // For now, we'll update the local storage stats
    const storedStats = localStorage.getItem('user_rewards_stats');
    if (storedStats) {
      const stats = JSON.parse(storedStats);
      stats.swigCircuitsCompleted += 1;
      localStorage.setItem('user_rewards_stats', JSON.stringify(stats));
    }
    
    toast({
      title: "Swig Circuit Completed!",
      description: "You've earned progress toward your next reward tier!"
    });
  };

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

  if (!swigCircuit) {
    return (
      <Layout>
        <div className="py-4 animate-fade-in max-w-6xl mx-auto">
          <BackButton fallbackPath="/profile/swig-circuits" />
          <h1 className="text-2xl font-bold mb-2">Swig Circuit Not Found</h1>
          <p className="mb-4 text-gray-600">
            The Swig Circuit you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild variant="default">
            <Link to="/profile/swig-circuits">
              Back to Swig Circuits
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Prepare map data
  const mapEstablishments = swigCircuit.establishments.map((establishment: any) => ({
    id: establishment.id,
    name: establishment.name,
    latitude: establishment.latitude,
    longitude: establishment.longitude,
    cocktailCount: establishment.cocktailCount
  }));

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-6xl mx-auto">
        <BackButton fallbackPath="/profile/swig-circuits" />
        
        <SwigCircuitProfileHeader 
          name={swigCircuit.name}
          participants={participants.length}
          date={swigCircuit.date}
          stops={swigCircuit.stops}
          id={id || ''}
        />

        <div className="flex justify-between items-center my-4">
          <Link to={`/profile/swig-circuits/checkin-scanner/${id}`}>
            <Button variant="outline" className="flex items-center">
              <QrCode className="mr-2 h-4 w-4" />
              Scan Check-in Code
            </Button>
          </Link>
          
          <Button onClick={markCompleted} className="flex items-center">
            <Award className="mr-2 h-4 w-4" />
            Mark Completed
          </Button>
        </div>

        <Tabs defaultValue="route" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="route">Circuit Route</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>
          
          <TabsContent value="route">
            <RouteTabContent 
              establishments={swigCircuit.establishments}
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
              organizer={swigCircuit.organizer}
              date={swigCircuit.date}
              stops={swigCircuit.stops}
              description={swigCircuit.description || "Join us for a fun night exploring the best alcohol-free establishments in the area. Enjoy special mocktails, meet new people, and experience the nightlife without the hangover!"}
              participants={participants}
            />
          </TabsContent>
          
          <TabsContent value="participants">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium">Participants</h3>
              </div>
              <div className="divide-y">
                {participants.map((participant) => (
                  <div key={participant.id} className="p-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      <img src={participant.avatar} alt={participant.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">{participant.name}</h4>
                        {participant.role === 'Organizer' && (
                          <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                            Organizer
                          </Badge>
                        )}
                      </div>
                      {participant.badges && participant.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {participant.badges.map((badge: string) => (
                            <Badge key={badge} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs flex items-center">
                              <Award className="h-3 w-3 mr-1" />
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SwigCircuitProfilePage;
