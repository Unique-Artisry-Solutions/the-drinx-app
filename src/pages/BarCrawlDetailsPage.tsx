
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, Navigation, Beer, AlertTriangle, Route, Share2 } from 'lucide-react';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import JoinBarCrawlButton from '@/components/barCrawl/JoinBarCrawlButton';

interface BarCrawlDetailsProps {}

const BarCrawlDetailsPage: React.FC<BarCrawlDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [barCrawl, setBarCrawl] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const { user } = useAuth();
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

          setParticipants([
            {
              id: '1',
              name: 'Alex Johnson',
              avatar: '/placeholder.svg',
              isActive: true,
              role: 'Organizer',
              joinedDate: '2023-10-01',
              status: 'Confirmed'
            },
            {
              id: '2',
              name: 'Jamie Smith',
              avatar: '/placeholder.svg',
              isActive: true,
              joinedDate: '2023-10-02',
              status: 'Confirmed'
            },
            {
              id: '3',
              name: 'Casey Wilson',
              avatar: '/placeholder.svg',
              isActive: true,
              joinedDate: '2023-10-03',
              status: 'Confirmed'
            },
            {
              id: '4',
              name: 'Taylor Rivera',
              avatar: '/placeholder.svg',
              isActive: false,
              joinedDate: '2023-10-04',
              status: 'Pending'
            },
            {
              id: '5',
              name: 'Morgan Lee',
              avatar: '/placeholder.svg',
              isActive: false,
              joinedDate: '2023-10-05',
              status: 'Tentative'
            }
          ]);
        }
        
        setLoading(false);
      }, 500);
    };
    
    fetchBarCrawl();
  }, [id]);

  const shareCircuit = () => {
    navigator.clipboard.writeText(`${window.location.origin}/bar-crawl/${id}`);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
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
          <h1 className="text-2xl font-bold mb-2">Swig Circuit Not Found</h1>
          <p className="mb-4 text-gray-600">
            The Swig Circuit you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild variant="default">
            <Link to="/swig-circuits">
              Back to Swig Circuits
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-6xl mx-auto">
        {/* Header Section - Improved with better spacing */}
        <div className="mb-6 bg-gradient-to-r from-spiritless-pink/20 to-spiritless-green/20 p-6 rounded-lg border border-spiritless-pink/30">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
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
              <p className="mt-3 text-material-on-surface">
                {barCrawl.description || "Join us for a fun night exploring the best alcohol-free establishments in the area. Enjoy special mocktails, meet new people, and experience the nightlife without the hangover!"}
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <JoinBarCrawlButton 
                barCrawlId={id || ''} 
                className="bg-spiritless-pink hover:bg-spiritless-pink/90"
              />
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={shareCircuit}
              >
                <Share2 size={16} />
                Share Link
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Crawl Route - 2/3 width on desktop */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-3">Crawl Route</h2>
                <div className="space-y-3">
                  {barCrawl.establishments.map((establishment: any, index: number) => (
                    <Link 
                      key={establishment.id}
                      to={`/establishment/${establishment.id}`}
                      className="block"
                    >
                      <div className="flex p-3 border rounded-lg relative hover:bg-gray-50/10 transition-colors cursor-pointer">
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
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Participants Card */}
          <div>
            <Card className="h-full">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-3">Active Participants</h2>
                <div className="space-y-2">
                  {participants.slice(0, 5).map((participant) => (
                    <div key={participant.id} className="flex items-center p-2 border rounded-lg">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <span className="font-medium">{participant.name}</span>
                        {participant.role && (
                          <Badge className="ml-2 bg-material-primary text-xs">{participant.role}</Badge>
                        )}
                      </div>
                      <Badge className={`${participant.status === 'Confirmed' ? 'bg-green-500' : participant.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                        {participant.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Width Participants Table Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">All Participants</h2>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {participants.map((participant) => (
                <Avatar key={participant.id} className="border-2 border-white -ml-2 first:ml-0 h-10 w-10 hover:z-10 transition-all">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{participant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`
                        ${participant.status === 'Confirmed' ? 'bg-green-500' : ''}
                        ${participant.status === 'Pending' ? 'bg-yellow-500' : ''}
                        ${participant.status === 'Tentative' ? 'bg-blue-500' : ''}
                      `}>
                        {participant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(participant.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{participant.role || 'Participant'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BarCrawlDetailsPage;
