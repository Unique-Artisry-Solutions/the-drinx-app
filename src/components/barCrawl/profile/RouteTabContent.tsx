
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight, Tag, QrCode, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Establishment {
  id: string;
  name: string;
  address: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  role?: string;
}

interface RouteTabContentProps {
  establishments: Establishment[];
  participants: Participant[];
  activeStop: number;
  id: string;
}

const RouteTabContent: React.FC<RouteTabContentProps> = ({
  establishments,
  participants,
  activeStop,
  id
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <ArrowRight className="h-5 w-5 mr-2 text-spiritless-pink" />
              Crawl Route
            </h2>
            <div className="space-y-2">
              {establishments.map((establishment, index) => (
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
            
            {establishments[activeStop] && (
              <div className="space-y-3">
                <div className="font-medium">{establishments[activeStop].name}</div>
                
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
                  <Link to={`/establishment/${establishments[activeStop].id}`}>
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
                {participants.slice(0, 3).map((person) => (
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
  );
};

export default RouteTabContent;
