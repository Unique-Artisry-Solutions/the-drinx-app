
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, Navigation, Beer, AlertTriangle } from 'lucide-react';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface BarCrawlDetailsProps {}

const BarCrawlDetailsPage: React.FC<BarCrawlDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [barCrawl, setBarCrawl] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [canJoin, setCanJoin] = useState(true);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState(false);
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user can join the bar crawl
  useEffect(() => {
    if (user && id) {
      const checkParticipation = async () => {
        try {
          // Check if user has already joined this specific bar crawl
          const { data: existingParticipation } = await supabase
            .from('user_bar_crawl_participation')
            .select('*')
            .eq('user_id', user.id)
            .eq('bar_crawl_id', id)
            .single();

          if (existingParticipation) {
            setIsAlreadyJoined(true);
            return;
          }

          // Check cooldown function to see if user can join a new bar crawl
          const { data: canJoinResult, error: canJoinError } = await supabase.rpc(
            'can_join_bar_crawl',
            { user_id: user.id }
          );

          if (canJoinError) {
            console.error('Error checking if user can join bar crawl:', canJoinError);
            return;
          }

          setCanJoin(canJoinResult);

          // If they can't join, get their most recent bar crawl to calculate cooldown
          if (!canJoinResult) {
            const { data: lastParticipation } = await supabase
              .from('user_bar_crawl_participation')
              .select('joined_at')
              .eq('user_id', user.id)
              .order('joined_at', { ascending: false })
              .limit(1)
              .single();

            if (lastParticipation) {
              // Calculate remaining time in the 12-hour cooldown
              const joinedAt = new Date(lastParticipation.joined_at);
              const cooldownEnds = new Date(joinedAt.getTime() + (12 * 60 * 60 * 1000)); // 12 hours in ms
              const now = new Date();
              const remainingMs = cooldownEnds.getTime() - now.getTime();
              
              if (remainingMs > 0) {
                const hours = Math.floor(remainingMs / (60 * 60 * 1000));
                const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
                setCooldownTimeRemaining(`${hours}h ${minutes}m`);
              }
            }
          }
        } catch (error) {
          console.error('Error checking participation:', error);
        }
      };

      checkParticipation();
    }
  }, [user, id]);

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

          // Generate sample participants with more information
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

  const handleJoinBarCrawl = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join this bar crawl",
        variant: "destructive",
      });
      return;
    }

    if (!canJoin && !isAlreadyJoined) {
      toast({
        title: "Participation limit reached",
        description: `You can only join one bar crawl every 12 hours. Please try again in ${cooldownTimeRemaining}.`,
        variant: "destructive",
      });
      return;
    }

    if (isAlreadyJoined) {
      toast({
        title: "Already participating",
        description: "You are already participating in this bar crawl",
      });
      return;
    }

    setIsJoining(true);

    try {
      // Insert into the participation table
      const { error } = await supabase
        .from('user_bar_crawl_participation')
        .insert({
          user_id: user.id,
          bar_crawl_id: id,
        });

      if (error) {
        throw error;
      }

      setIsAlreadyJoined(true);
      toast({
        title: "Successfully joined!",
        description: "You've been added to this bar crawl",
      });
    } catch (error: any) {
      console.error('Error joining bar crawl:', error);
      toast({
        title: "Failed to join",
        description: error.message || "An error occurred while trying to join the bar crawl",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
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
        
        {!canJoin && !isAlreadyJoined && (
          <Alert className="mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Participation Limit Reached</AlertTitle>
            <AlertDescription>
              You can only join one bar crawl every 12 hours. Please try again in {cooldownTimeRemaining}.
            </AlertDescription>
          </Alert>
        )}
        
        {isAlreadyJoined && (
          <Alert className="mb-6" variant="default">
            <AlertTitle>You're participating in this bar crawl!</AlertTitle>
            <AlertDescription>
              You've already joined this bar crawl. Enjoy the experience!
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          
          {/* Participants Preview */}
          <div>
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-3">Participants</h2>
                <div className="space-y-2">
                  {participants.slice(0, 3).map((participant) => (
                    <div key={participant.id} className="flex items-center p-2 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                        <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <span className="font-medium">{participant.name}</span>
                        {participant.role && (
                          <Badge className="ml-2 bg-material-primary text-xs">{participant.role}</Badge>
                        )}
                      </div>
                      <Badge className={`${participant.isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {participant.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={handleJoinBarCrawl}
                    disabled={isJoining || (!canJoin && !isAlreadyJoined)} 
                    className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    {isAlreadyJoined 
                      ? "Already Joined!" 
                      : isJoining 
                        ? "Joining..." 
                        : "Join This Crawl"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Participants List */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Current Participants</h2>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center">
                  <Avatar className="border-2 border-white -ml-2 first:ml-0 h-10 w-10 hover:z-10 transition-all">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
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
