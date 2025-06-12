import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Users, Calendar, Star, CheckCircle, Clock, Ticket } from 'lucide-react';
import FollowButton from '@/components/common/FollowButton';
import type { Promoter, PromoterEvent } from '@/types/explore';

const PromoterDetailsPage: React.FC = () => {
  const { promoterId } = useParams<{ promoterId: string }>();

  // Mock promoter data - in real app, fetch from API
  const promoter: Promoter = {
    id: promoterId || 'p1',
    name: 'Mindful Events Co.',
    description: 'Creating transformative experiences through mindful gatherings and wellness-focused events. We believe in bringing people together through intentional, alcohol-free experiences that nourish the body, mind, and spirit.',
    avatar_url: '/api/placeholder/128/128',
    banner_url: '/api/placeholder/800/300',
    follower_count: 2340,
    event_count: 15,
    category: 'Wellness',
    location: 'San Francisco, CA',
    rating: 4.8,
    tags: ['mindfulness', 'wellness', 'community', 'meditation', 'organic'],
    is_verified: true,
    upcoming_events: [
      {
        id: 'e1',
        title: 'Mindful Mocktail Meditation',
        description: 'Join us for an evening of guided meditation paired with artisanal non-alcoholic beverages.',
        date: '2024-01-20',
        time: '7:00 PM',
        location: 'Zen Garden Lounge',
        image_url: '/api/placeholder/400/200',
        ticket_price: 35,
        status: 'upcoming',
        attendee_count: 45
      },
      {
        id: 'e2',
        title: 'Sound Bath & Sips',
        description: 'Experience deep relaxation with sound healing while enjoying herbal-infused mocktails.',
        date: '2024-01-25',
        time: '6:30 PM',
        location: 'Harmony Studio',
        image_url: '/api/placeholder/400/200',
        ticket_price: 42,
        status: 'upcoming',
        attendee_count: 28
      }
    ],
    past_events: [
      {
        id: 'e3',
        title: 'New Year Intention Setting',
        description: 'Started the year with clarity and purpose through guided intention setting.',
        date: '2024-01-01',
        time: '10:00 AM',
        location: 'Sunrise Terrace',
        image_url: '/api/placeholder/400/200',
        status: 'past',
        attendee_count: 82
      },
      {
        id: 'e4',
        title: 'Holiday Gratitude Gathering',
        description: 'Celebrated the season with gratitude practices and warming beverages.',
        date: '2023-12-15',
        time: '4:00 PM',
        location: 'Community Center',
        image_url: '/api/placeholder/400/200',
        status: 'past',
        attendee_count: 67
      }
    ]
  };

  const EventCard: React.FC<{ event: PromoterEvent }> = ({ event }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="h-32 bg-gradient-to-r from-gray-100 to-gray-200"
        style={{ 
          backgroundImage: `url(${event.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="h-full bg-black/20 flex items-end p-4">
          <Badge 
            className={
              event.status === 'upcoming' ? 'bg-green-500 text-white' :
              event.status === 'live' ? 'bg-red-500 text-white' :
              'bg-gray-500 text-white'
            }
          >
            {event.status === 'upcoming' ? 'Upcoming' :
             event.status === 'live' ? 'Live Now' :
             'Past Event'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {event.time}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {event.attendee_count} attendees
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {event.ticket_price && (
            <div className="flex items-center text-lg font-semibold">
              <Ticket className="w-4 h-4 mr-1" />
              ${event.ticket_price}
            </div>
          )}
          
          <Button 
            size="sm" 
            disabled={event.status === 'past'}
            className="ml-auto"
          >
            {event.status === 'past' ? 'View Details' : 'Get Tickets'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Banner */}
        <div 
          className="h-48 md:h-64 rounded-xl mb-6 relative overflow-hidden"
          style={{ 
            backgroundImage: `url(${promoter.banner_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Promoter Info */}
        <div className="relative -mt-20 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={promoter.avatar_url} alt={promoter.name} />
                    <AvatarFallback>{promoter.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {promoter.is_verified && (
                    <CheckCircle className="absolute -bottom-1 -right-1 w-8 h-8 text-blue-500 bg-white rounded-full p-1" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <h1 className="text-3xl font-bold">{promoter.name}</h1>
                    <FollowButton
                      promoterId={promoterId}
                      promoterName={promoter?.display_name || promoter?.username || 'this promoter'}
                      variant="default"
                      size="default"
                      showFollowerCount={true}
                    />
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{promoter.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{promoter.category}</Badge>
                    {promoter.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {promoter.follower_count.toLocaleString()} followers
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {promoter.event_count} events
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {promoter.location}
                    </div>
                    {promoter.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {promoter.rating.toFixed(1)} rating
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming Events ({promoter.upcoming_events?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Events ({promoter.past_events?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {promoter.upcoming_events && promoter.upcoming_events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promoter.upcoming_events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground">
                    Follow this promoter to be notified when new events are announced.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {promoter.past_events && promoter.past_events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promoter.past_events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Past Events</h3>
                  <p className="text-muted-foreground">
                    This promoter hasn't hosted any events yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterDetailsPage;
