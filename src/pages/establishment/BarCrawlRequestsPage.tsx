
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, UserIcon, Clock, MapPin, Info } from 'lucide-react';
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
import { useBarCrawlRequests } from '@/hooks/useBarCrawlRequests';
import BarCrawlCard from '@/components/establishment/BarCrawlCard';

const BarCrawlRequestsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pending");

  // Sample data - in a real implementation, this would come from Supabase
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
      description: 'A health-focused journey through the city's best wellness-oriented beverage establishments.',
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
      specialRequests: 'Looking for upscale presentation and celebratory ambiance suitable for New Year's Eve.'
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

  // Convert the sample data to the format expected by BarCrawlCard
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
        <h1 className="text-2xl font-bold gradient-text mb-4">Swig Circuit Requests</h1>
        <p className="text-material-on-surface-variant mb-6">
          Review and manage requests to include your establishment in Swig Circuits
        </p>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="accepted">Accepted Circuits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {formattedPendingRequests.length === 0 ? (
              <Card className="vibrant-card">
                <CardContent className="p-6 text-center">
                  <p className="text-material-on-surface-variant">
                    No pending Swig Circuit requests at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {formattedPendingRequests.map((request) => (
                  <Card key={request.id} className="vibrant-card hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pt-5">
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium">{request.name}</h3>
                            
                            <div className="flex items-center text-sm text-material-on-surface-variant">
                              <UserIcon className="h-4 w-4 mr-1" />
                              <span>Organized by {request.organizer}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center text-sm text-material-on-surface-variant">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                <span>{request.date}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-material-on-surface-variant">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{request.time}</span>
                              </div>
                              
                              <div className="text-sm text-material-on-surface-variant">
                                <span>{request.participants} participants</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4 md:mt-0">
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
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                        
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="details">
                            <AccordionTrigger className="text-sm font-medium text-primary">
                              <Info className="h-4 w-4 mr-1" />
                              View Circuit Details
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 p-2">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Description</h4>
                                  <p className="text-sm text-material-on-surface-variant">{request.description}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Other Participating Establishments</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {request.otherEstablishments.map((establishment, idx) => (
                                      <Badge key={idx} variant="outline" className="bg-material-surface-container-low">
                                        {establishment}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Expected Duration</h4>
                                    <p className="text-sm text-material-on-surface-variant">{request.expectedDuration}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Special Requests</h4>
                                    <p className="text-sm text-material-on-surface-variant">{request.specialRequests || 'None'}</p>
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
          
          <TabsContent value="accepted">
            {formattedAcceptedRequests.length === 0 ? (
              <Card className="vibrant-card">
                <CardContent className="p-6 text-center">
                  <p className="text-material-on-surface-variant">
                    You haven't accepted any Swig Circuit requests yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {formattedAcceptedRequests.map((crawl) => (
                  <BarCrawlCard 
                    key={crawl.id}
                    crawl={crawl}
                    handleEndParticipation={handleEndParticipation}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BarCrawlRequestsPage;
