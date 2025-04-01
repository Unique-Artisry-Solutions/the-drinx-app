
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, Clock, MapPin, ArrowRight, Tag, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';
import MapView from '@/components/map/MapView';
import BackButton from '@/components/navigation/BackButton';

interface BarCrawlProfileProps {}

const BarCrawlProfilePage: React.FC<BarCrawlProfileProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [barCrawl, setBarCrawl] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [activeStop, setActiveStop] = useState<number>(0);
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

  const handleShareBarCrawl = () => {
    toast({
      title: "Bar Crawl Shared",
      description: "Invitation link copied to clipboard"
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

  if (!barCrawl) {
    return (
      <Layout>
        <div className="py-4 animate-fade-in max-w-6xl mx-auto">
          <BackButton />
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
        <BackButton />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{barCrawl.name}</h1>
            <div className="flex flex-wrap gap-2 text-gray-600 mt-1">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{participants.length} participants</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{barCrawl.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{barCrawl.stops} stops</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShareBarCrawl}
            >
              Invite Friends
            </Button>
            <Button 
              size="sm"
              asChild
            >
              <Link to={`/profile/bar-crawls/participants/${id}`}>
                View Participants
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="route" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="route">Crawl Route</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="route">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-medium mb-3 flex items-center">
                      <ArrowRight className="h-5 w-5 mr-2 text-spiritless-pink" />
                      Crawl Route
                    </h2>
                    <div className="space-y-2">
                      {barCrawl.establishments.map((establishment: any, index: number) => (
                        <div 
                          key={establishment.id} 
                          className={`border rounded-lg p-3 ${index === activeStop ? 'border-spiritless-pink bg-spiritless-pink/5' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className={`flex items-center justify-center rounded-full h-6 w-6 text-sm mr-3 ${index === activeStop ? 'bg-spiritless-pink text-white' : 'bg-gray-200'}`}>
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-medium">{establishment.name}</h3>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{establishment.address}</span>
                                </div>
                              </div>
                            </div>
                            
                            {index === activeStop && (
                              <Badge className="bg-spiritless-pink">Current Stop</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-medium mb-3">Current Stop</h2>
                    
                    {barCrawl.establishments[activeStop] && (
                      <div className="space-y-3">
                        <div className="font-medium">{barCrawl.establishments[activeStop].name}</div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>3 people here</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span>Until 10PM</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-1">
                          <Tag className="h-4 w-4 mr-1 text-spiritless-pink" />
                          <span className="text-sm font-medium">Promo Code:</span>
                          <span className="ml-2 bg-spiritless-pink/10 text-spiritless-pink px-2 py-0.5 rounded text-sm font-mono">
                            SPIRITLESS25
                          </span>
                        </div>
                        
                        <div className="flex justify-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <QrCode className="h-16 w-16 mx-auto mb-1 text-gray-700" />
                            <p className="text-xs text-gray-500">Show for special offers</p>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          asChild
                          size="sm"
                        >
                          <Link to={`/establishment/${barCrawl.establishments[activeStop].id}`}>
                            Visit Establishment Page
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="mt-3">
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="text-lg font-medium mb-3">Participants</h2>
                      <div className="space-y-2">
                        {participants.slice(0, 3).map((person: any) => (
                          <div key={person.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={person.avatar} alt={person.name} />
                                <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{person.name}</div>
                                {person.role && (
                                  <div className="text-xs text-gray-500">{person.role}</div>
                                )}
                              </div>
                            </div>
                            {person.isActive && (
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            )}
                          </div>
                        ))}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-1"
                          asChild
                        >
                          <Link to={`/profile/bar-crawls/participants/${id}`}>
                            View All
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="map">
            <div className="border rounded-lg overflow-hidden h-[450px]">
              <MapView 
                establishments={mapEstablishments} 
                userLocation={null}
                onRefreshLocation={() => {}}
                isLoadingLocation={false}
                singleEstablishmentView={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-medium mb-3">Event Details</h2>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium">Organizer</div>
                        <div>{barCrawl.organizer}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Date</div>
                        <div>{barCrawl.date}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Number of Stops</div>
                        <div>{barCrawl.stops}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Description</div>
                        <div className="text-sm text-gray-700">
                          {barCrawl.description || "Join us for a fun night exploring the best alcohol-free establishments in the area. Enjoy special mocktails, meet new people, and experience the nightlife without the hangover!"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium mb-3">Participants ({participants.length})</h2>
                    <div className="space-y-2">
                      {participants.map((person: any) => (
                        <div key={person.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={person.avatar} alt={person.name} />
                              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{person.name}</div>
                              {person.role && (
                                <div className="text-xs text-gray-500">{person.role}</div>
                              )}
                            </div>
                          </div>
                          {person.isActive && (
                            <Badge className="bg-green-500">Active</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BarCrawlProfilePage;
