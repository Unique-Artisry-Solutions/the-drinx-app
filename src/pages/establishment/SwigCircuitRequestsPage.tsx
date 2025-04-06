import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, UserIcon, Clock, MapPin, Info, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarCrawlCard from '@/components/establishment/BarCrawlCard';

const SwigCircuitRequestsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pending");

  const barCrawlRequests = [
    {
      id: '1',
      name: 'Holiday Mocktail Crawl',
      organizer: 'Mike Wilson',
      participants: 15,
      date: '2023-12-15',
      time: '7:00 PM',
      status: 'pending',
      description: 'A festive tour of the best holiday-themed mocktails around town. Celebrate the season with unique flavors and creative presentations.',
      otherEstablishments: ['The Juice Bar', 'Herbal Infusions', 'Tropical Blends'],
      expectedDuration: '3 hours',
      specialRequests: 'Looking for establishments to feature at least one holiday-themed mocktail during the event.'
    },
    {
      id: '2',
      name: 'Weekend Wellness Tour',
      organizer: 'Ashley Bennett',
      participants: 12,
      date: '2023-12-20',
      time: '6:30 PM',
      status: 'pending',
      description: 'A health-focused journey through the city\'s best wellness-oriented beverage establishments.',
      otherEstablishments: ['Green Garden', 'Wellness Lounge', 'Pure Refreshment'],
      expectedDuration: '2.5 hours',
      specialRequests: 'Would appreciate if you could highlight your most nutritious options.'
    },
    {
      id: '3',
      name: 'New Year Spirits-Free Adventure',
      organizer: 'Jordan Taylor',
      participants: 20,
      date: '2023-12-31',
      time: '8:00 PM',
      status: 'pending',
      description: 'Ring in the New Year with sophisticated non-alcoholic alternatives. This circuit aims to showcase creative mixology without the alcohol.',
      otherEstablishments: ['Sober Social', 'Mindful Mixes', 'Zero Proof'],
      expectedDuration: '4 hours',
      specialRequests: 'Looking for upscale presentation and celebratory ambiance suitable for New Year\'s Eve.'
    }
  ];

  const acceptedRequests = [
    {
      id: '4',
      name: 'Downtown Mocktail Tour',
      organizer: 'John Smith',
      participants: 12,
      date: '2023-11-15',
      time: '7:00 PM',
      status: 'accepted',
      startDate: '2023-11-15',
      endDate: '2023-11-15',
      description: 'A tour of the best mocktail spots downtown.',
      otherEstablishments: ['The Juice Bar', 'Herbal Infusions'],
      expectedDuration: '3 hours',
      specialRequests: 'None'
    },
    {
      id: '5',
      name: 'Weekend Spirits-Free Adventure',
      organizer: 'Sarah Johnson',
      participants: 8,
      date: '2023-11-20',
      time: '6:30 PM',
      status: 'accepted',
      startDate: '2023-11-20',
      endDate: '2023-11-20',
      description: 'Experience the best alcohol-free drinks in the city.',
      otherEstablishments: ['Green Garden', 'Wellness Lounge'],
      expectedDuration: '2.5 hours',
      specialRequests: 'Would like to have a private area reserved.'
    }
  ];

  const formattedPendingRequests = barCrawlRequests.map(req => ({
    id: req.id,
    name: req.name,
    date: req.date,
    participants: req.participants,
    organizer: req.organizer,
    startDate: req.date,
    endDate: req.date,
    status: 'pending' as const,
    otherEstablishments: req.otherEstablishments,
    description: req.description,
    time: req.time,
    expectedDuration: req.expectedDuration,
    specialRequests: req.specialRequests
  }));

  const formattedAcceptedRequests = acceptedRequests.map(req => ({
    id: req.id,
    name: req.name,
    date: req.date,
    participants: req.participants,
    organizer: req.organizer,
    startDate: req.startDate,
    endDate: req.endDate,
    status: 'accepted' as const,
    otherEstablishments: req.otherEstablishments,
    description: req.description,
    time: req.time,
    expectedDuration: req.expectedDuration,
    specialRequests: req.specialRequests
  }));

  const handleAcceptRequest = (id: string) => {
    toast({
      title: 'Request Accepted',
      description: 'You have successfully accepted this Swig Circuit request.'
    });
  };

  const handleDeclineRequest = (id: string) => {
    toast({
      title: 'Request Declined',
      description: 'You have declined this Swig Circuit request.'
    });
  };

  const handleEndParticipation = (id: string) => {
    toast({
      title: 'Participation Ended',
      description: 'You have ended your participation in this Swig Circuit.'
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-spiritless-pink to-spiritless-orange bg-clip-text text-transparent">
            Swig Circuit Requests
          </h1>
          <p className="text-material-on-surface-variant text-lg">
            Review and manage requests to include your establishment in Swig Circuits
          </p>
        </div>

        <Tabs 
          defaultValue="pending" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <TabsList className="mb-4 bg-gray-100/80 w-full justify-start gap-2 p-1">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-spiritless-pink/20 data-[state=active]:to-spiritless-orange/20 data-[state=active]:text-spiritless-pink font-medium"
            >
              Pending Requests
            </TabsTrigger>
            <TabsTrigger 
              value="accepted" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-spiritless-pink/20 data-[state=active]:to-spiritless-orange/20 data-[state=active]:text-spiritless-pink font-medium"
            >
              Accepted Circuits
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            {formattedPendingRequests.length === 0 ? (
              <Card className="vibrant-card bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-spiritless-pink shadow-md">
                <CardContent className="p-8 text-center">
                  <p className="text-material-on-surface-variant text-lg">
                    No pending Swig Circuit requests at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {formattedPendingRequests.map((request) => (
                  <Card 
                    key={request.id} 
                    className="vibrant-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border-l-4 border-spiritless-pink overflow-hidden"
                  >
                    <CardHeader className="p-4 pb-0 bg-gradient-to-r from-spiritless-pink/5 to-spiritless-orange/5">
                      <CardTitle className="text-lg font-medium text-gray-800">
                        {request.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="space-y-3">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-spiritless-pink/10 text-spiritless-pink">
                              <UserIcon className="h-4 w-4 mr-2" />
                              <span className="font-medium">Organized by {request.organizer}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              <div className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-100">
                                <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="font-medium text-gray-700">{request.date}</span>
                              </div>
                              
                              <div className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-100">
                                <Clock className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="font-medium text-gray-700">{request.time}</span>
                              </div>
                              
                              <div className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-100">
                                <Users className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="font-medium text-gray-700">{request.participants} participants</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 mt-4 md:mt-0">
                            <Button 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-50" 
                              onClick={() => handleDeclineRequest(request.id)}
                            >
                              Decline
                            </Button>
                            <Button 
                              variant="gradient" 
                              onClick={() => handleAcceptRequest(request.id)}
                              className="shadow-md hover:shadow-lg transition-shadow"
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                        
                        <Accordion type="single" collapsible className="w-full border-t border-gray-100 pt-2">
                          <AccordionItem value="details" className="border-b-0">
                            <AccordionTrigger className="text-sm font-medium text-primary hover:no-underline py-2">
                              <div className="flex items-center text-spiritless-pink">
                                <Info className="h-4 w-4 mr-2" />
                                View Circuit Details
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-gray-50 rounded-lg">
                              <div className="space-y-4 p-4">
                                <div className="bg-white p-3 rounded-md shadow-sm">
                                  <h4 className="text-sm font-medium mb-2 text-gray-700">Description</h4>
                                  <p className="text-sm text-gray-600">{request.description}</p>
                                </div>
                                
                                <div className="bg-white p-3 rounded-md shadow-sm">
                                  <h4 className="text-sm font-medium mb-2 text-gray-700">Other Participating Establishments</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {request.otherEstablishments.map((establishment, idx) => (
                                      <Badge 
                                        key={idx} 
                                        variant="outline" 
                                        className="bg-spiritless-orange/10 border-spiritless-orange/20 text-spiritless-orange px-3 py-1"
                                      >
                                        {establishment}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-white p-3 rounded-md shadow-sm">
                                    <h4 className="text-sm font-medium mb-2 text-gray-700">Expected Duration</h4>
                                    <p className="text-sm text-gray-600 font-medium">{request.expectedDuration}</p>
                                  </div>
                                  
                                  <div className="bg-white p-3 rounded-md shadow-sm">
                                    <h4 className="text-sm font-medium mb-2 text-gray-700">Special Requests</h4>
                                    <p className="text-sm text-gray-600">{request.specialRequests || 'None'}</p>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="accepted" className="mt-6">
            {formattedAcceptedRequests.length === 0 ? (
              <Card className="vibrant-card bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-spiritless-green shadow-md">
                <CardContent className="p-8 text-center">
                  <p className="text-material-on-surface-variant text-lg">
                    You haven't accepted any Swig Circuit requests yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {formattedAcceptedRequests.map((crawl) => (
                  <div key={crawl.id} className="transform transition-all duration-300 hover:-translate-y-1">
                    <BarCrawlCard 
                      crawl={crawl}
                      handleEndParticipation={handleEndParticipation}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SwigCircuitRequestsPage;
