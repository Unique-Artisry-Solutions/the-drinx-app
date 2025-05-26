
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Plus, MapPin } from 'lucide-react';

const PromoterEvents: React.FC = () => {
  const events = [
    {
      id: 1,
      title: "Summer Music Festival",
      date: "2024-02-15",
      time: "18:00",
      location: "Central Park",
      attendees: 150,
      status: "active"
    },
    {
      id: 2,
      title: "Tech Networking Night",
      date: "2024-02-22",
      time: "19:00",
      location: "Innovation Hub",
      attendees: 75,
      status: "upcoming"
    },
    {
      id: 3,
      title: "Art Gallery Opening",
      date: "2024-02-08",
      time: "17:00",
      location: "Modern Art Gallery",
      attendees: 120,
      status: "completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-600 mt-2">Manage your promotional events</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.time}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {event.attendees} attendees
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {events.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No events yet</CardTitle>
              <CardDescription className="mb-4">
                Create your first promotional event to get started
              </CardDescription>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PromoterEvents;
