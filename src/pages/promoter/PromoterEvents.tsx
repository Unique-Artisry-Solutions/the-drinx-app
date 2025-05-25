
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Plus, DollarSign, MapPin } from 'lucide-react';

const PromoterEvents: React.FC = () => {
  const events = [
    {
      id: 1,
      title: "Summer Swig Circuit",
      venue: "Downtown Bar District",
      date: "2024-01-20",
      time: "18:00",
      attendees: 234,
      ticketsSold: 234,
      totalTickets: 300,
      revenue: "$4,680",
      status: "active"
    },
    {
      id: 2,
      title: "Mocktail Masterclass Series",
      venue: "The Spiritless Lounge",
      date: "2024-01-25",
      time: "19:30",
      attendees: 67,
      ticketsSold: 67,
      totalTickets: 80,
      revenue: "$1,340",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Non-Alcoholic Wine Tasting",
      venue: "Urban Garden",
      date: "2024-01-10",
      time: "17:00",
      attendees: 45,
      ticketsSold: 45,
      totalTickets: 50,
      revenue: "$1,350",
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">Manage and track your promotional events</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                {event.venue}
              </CardDescription>
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
                <Users className="h-4 w-4 mr-2" />
                {event.ticketsSold}/{event.totalTickets} tickets sold
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                {event.revenue} revenue
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-spiritless-pink h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Analytics
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
  );
};

export default PromoterEvents;
