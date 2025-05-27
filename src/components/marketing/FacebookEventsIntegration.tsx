
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Calendar, MapPin, Users } from 'lucide-react';

interface FacebookEventsIntegrationProps {
  eventId: string;
  eventData: {
    name: string;
    description: string;
    date: string;
    time: string;
    venue: string;
  };
}

const FacebookEventsIntegration: React.FC<FacebookEventsIntegrationProps> = ({
  eventId,
  eventData
}) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [eventType, setEventType] = useState('public');
  const [category, setCategory] = useState('entertainment');
  const [coverImage, setCoverImage] = useState('');

  const handleConnectFacebook = () => {
    // Placeholder for Facebook API connection
    setIsConnected(true);
    toast({
      title: "Facebook Connected",
      description: "Your Facebook account has been connected successfully"
    });
  };

  const handleCreateFacebookEvent = () => {
    toast({
      title: "Facebook Event Created",
      description: "Your event has been published to Facebook"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          Facebook Events
        </CardTitle>
        <CardDescription>
          Create and manage Facebook events for your promotion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center py-6 space-y-4">
            <Facebook className="h-12 w-12 mx-auto text-gray-400" />
            <p className="text-muted-foreground">Connect your Facebook account to create events</p>
            <Button onClick={handleConnectFacebook}>
              Connect Facebook
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <Label>Event Name</Label>
                <Input value={eventData.name} readOnly className="bg-gray-50" />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={eventData.description} readOnly className="bg-gray-50 min-h-[100px]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger id="event-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="food-drink">Food & Drink</SelectItem>
                      <SelectItem value="nightlife">Nightlife</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">{eventData.date}</div>
                    <div className="text-xs text-gray-500">{eventData.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">{eventData.venue}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">Public Event</div>
                </div>
              </div>

              <Button onClick={handleCreateFacebookEvent} className="w-full">
                Create Facebook Event
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FacebookEventsIntegration;
