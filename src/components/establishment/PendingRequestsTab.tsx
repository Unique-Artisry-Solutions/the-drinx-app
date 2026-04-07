
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Info, Calendar } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SwigCircuitRequest } from '@/hooks/useSwigCircuitRequests';

interface PendingRequestsTabProps {
  pendingRequests: SwigCircuitRequest[];
  handleAcceptRequest: (id: string) => void;
  handleDeclineRequest: (id: string) => void;
}

const PendingRequestsTab: React.FC<PendingRequestsTabProps> = ({ 
  pendingRequests, 
  handleAcceptRequest, 
  handleDeclineRequest 
}) => {
  return (
    <>
      {pendingRequests.length === 0 ? (
        <Card className="vibrant-card bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-spiritless-pink shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-material-on-surface-variant text-lg">
              No pending Swig Circuit requests at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingRequests.map((request) => (
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
                        <Users className="h-4 w-4 mr-2" />
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
    </>
  );
};

export default PendingRequestsTab;
