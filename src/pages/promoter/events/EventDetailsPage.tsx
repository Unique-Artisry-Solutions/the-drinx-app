
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket,
  DollarSign,
  Share2,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for event details
const eventData = {
  id: '1',
  name: 'Summer Mocktail Festival',
  description: 'Join us for a fantastic summer evening filled with creative mocktails, music, and fun. Meet mixologists from around the city and learn their secrets!',
  date: 'August 15, 2025',
  time: '6:00 PM - 10:00 PM',
  venue: 'The Purple Lounge',
  address: '123 Main St, Anytown, CA',
  status: 'published',
  imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1925&q=80',
  attendees: {
    registered: 120,
    capacity: 200,
    checkedIn: 0
  },
  tickets: [
    {
      id: 't1',
      name: 'General Admission',
      price: 25,
      sold: 85,
      available: 100
    },
    {
      id: 't2',
      name: 'VIP Experience',
      price: 75,
      sold: 35,
      available: 50
    }
  ],
  revenue: {
    total: 4750,
    ticketSales: 4750,
    additionalSales: 0
  }
};

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  // In a real app, fetch the event data using the eventId
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/promoter/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        {/* Event Header */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <div className="h-64 relative">
            <img 
              src={eventData.imageUrl}
              alt={eventData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex justify-between items-end">
              <div>
                <Badge className={
                  eventData.status === 'published' ? 'bg-green-500' : 
                  eventData.status === 'draft' ? 'bg-gray-500' :
                  eventData.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                }>
                  {eventData.status === 'published' ? 'Active' :
                   eventData.status === 'draft' ? 'Draft' :
                   eventData.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                </Badge>
                <h1 className="text-3xl font-bold mt-2">{eventData.name}</h1>
                <div className="flex items-center mt-2 text-gray-200">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{eventData.date}</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{eventData.time}</span>
                </div>
                <div className="flex items-center mt-2 text-gray-200">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{eventData.venue} - {eventData.address}</span>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
            </div>
          </div>
        </div>

        {/* Event Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="ticketing">Ticketing</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              {/* Attendees Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Attendees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {eventData.attendees.registered} / {eventData.attendees.capacity}
                  </div>
                  <p className="text-sm text-gray-500">
                    {Math.round((eventData.attendees.registered / eventData.attendees.capacity) * 100)}% of capacity
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${(eventData.attendees.registered / eventData.attendees.capacity) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Ticket Sales Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 flex items-center">
                    <Ticket className="h-4 w-4 mr-2" />
                    Ticket Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {eventData.tickets.reduce((acc, ticket) => acc + ticket.sold, 0)} sold
                  </div>
                  <p className="text-sm text-gray-500">
                    {eventData.tickets.reduce((acc, ticket) => acc + ticket.available - ticket.sold, 0)} available
                  </p>
                </CardContent>
              </Card>
              
              {/* Revenue Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${eventData.revenue.total.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">
                    From ticket sales
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">
                  {eventData.description}
                </p>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span>View Guest List</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                <Share2 className="h-5 w-5" />
                <span>Share Event</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                <Ticket className="h-5 w-5" />
                <span>Manage Tickets</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 text-yellow-600 border-yellow-200 bg-yellow-50 hover:bg-yellow-100">
                <AlertTriangle className="h-5 w-5" />
                <span>Cancel Event</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="attendees">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center py-8 text-gray-500">
                  Attendee management functionality will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ticketing">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventData.tickets.map(ticket => (
                    <div key={ticket.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{ticket.name}</h3>
                        <span className="font-semibold">${ticket.price}</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-sm">
                        <span className="text-gray-600">{ticket.sold} sold / {ticket.available} total</span>
                        <span className="text-green-600">
                          ${(ticket.sold * ticket.price).toLocaleString()} revenue
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(ticket.sold / ticket.available) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="marketing">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center py-8 text-gray-500">
                  Marketing tools will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
