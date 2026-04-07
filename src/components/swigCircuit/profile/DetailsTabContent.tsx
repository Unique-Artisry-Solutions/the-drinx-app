
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  role?: string;
}

interface DetailsTabContentProps {
  organizer: string;
  date: string;
  stops: number;
  description: string;
  participants: Participant[];
}

const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  organizer,
  date,
  stops,
  description,
  participants
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-3">Event Details</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium">Organizer</div>
                <div>{organizer}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Date</div>
                <div>{date}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Number of Stops</div>
                <div>{stops}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Description</div>
                <div className="text-sm text-gray-700">
                  {description || "Join us for a fun night exploring the best alcohol-free establishments in the area. Enjoy special mocktails, meet new people, and experience the nightlife without the hangover!"}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-3">Participants ({participants.length})</h2>
            <div className="space-y-2">
              {participants.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-2 border rounded-md">
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
                    <Badge className="bg-green-500">Active</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsTabContent;
