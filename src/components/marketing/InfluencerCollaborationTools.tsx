
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Users, Star, MessageCircle, Send, Eye, Heart } from 'lucide-react';

interface Influencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement: number;
  category: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
}

interface InfluencerCollaborationToolsProps {
  eventId: string;
  eventName: string;
}

const InfluencerCollaborationTools: React.FC<InfluencerCollaborationToolsProps> = ({
  eventId,
  eventName
}) => {
  const { toast } = useToast();
  const [influencers, setInfluencers] = useState<Influencer[]>([
    {
      id: '1',
      name: 'Sarah Martinez',
      platform: 'Instagram',
      followers: 25000,
      engagement: 4.2,
      category: 'Lifestyle',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Alex Chen',
      platform: 'TikTok',
      followers: 50000,
      engagement: 6.8,
      category: 'Food & Drink',
      status: 'accepted'
    }
  ]);

  const [newInfluencer, setNewInfluencer] = useState({
    name: '',
    platform: '',
    handle: ''
  });

  const [collaborationMessage, setCollaborationMessage] = useState('');

  const handleAddInfluencer = () => {
    if (!newInfluencer.name || !newInfluencer.platform || !newInfluencer.handle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all influencer details",
        variant: "destructive"
      });
      return;
    }

    const influencer: Influencer = {
      id: Date.now().toString(),
      name: newInfluencer.name,
      platform: newInfluencer.platform,
      followers: Math.floor(Math.random() * 100000) + 5000,
      engagement: Math.round((Math.random() * 10 + 1) * 10) / 10,
      category: 'General',
      status: 'pending'
    };

    setInfluencers([...influencers, influencer]);
    setNewInfluencer({ name: '', platform: '', handle: '' });

    toast({
      title: "Influencer Added",
      description: "Influencer has been added to your collaboration list"
    });
  };

  const handleSendCollaboration = (influencerId: string) => {
    setInfluencers(influencers.map(inf => 
      inf.id === influencerId ? { ...inf, status: 'pending' } : inf
    ));

    toast({
      title: "Collaboration Sent",
      description: "Your collaboration request has been sent"
    });
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'accepted': return 'secondary';
      case 'declined': return 'destructive';
      case 'completed': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Influencer Collaboration
          </CardTitle>
          <CardDescription>
            Find and collaborate with influencers to promote your event
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="inf-name">Influencer Name</Label>
              <Input
                id="inf-name"
                value={newInfluencer.name}
                onChange={(e) => setNewInfluencer({...newInfluencer, name: e.target.value})}
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="inf-platform">Platform</Label>
              <Input
                id="inf-platform"
                value={newInfluencer.platform}
                onChange={(e) => setNewInfluencer({...newInfluencer, platform: e.target.value})}
                placeholder="Instagram, TikTok, etc."
              />
            </div>
            <div>
              <Label htmlFor="inf-handle">Handle</Label>
              <Input
                id="inf-handle"
                value={newInfluencer.handle}
                onChange={(e) => setNewInfluencer({...newInfluencer, handle: e.target.value})}
                placeholder="@username"
              />
            </div>
          </div>

          <Button onClick={handleAddInfluencer} className="w-full">
            Add Influencer
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collaboration Message Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={collaborationMessage}
            onChange={(e) => setCollaborationMessage(e.target.value)}
            placeholder={`Hi [Influencer Name],\n\nWe'd love to collaborate with you on promoting our upcoming event "${eventName}". We believe your audience would be interested in this unique experience.\n\nWhat we're offering:\n- Event tickets\n- Promotional content kit\n- Performance bonus based on engagement\n\nLet us know if you're interested!\n\nBest regards,\n[Your Name]`}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Influencer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {influencers.map(influencer => (
              <div key={influencer.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{influencer.name}</h4>
                    <p className="text-sm text-gray-500">{influencer.platform} • {influencer.category}</p>
                  </div>
                  <Badge variant={getStatusColor(influencer.status)}>
                    {influencer.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{formatFollowers(influencer.followers)} followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <span>{influencer.engagement}% engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-500" />
                    <span>4.8 rating</span>
                  </div>
                </div>

                {influencer.status === 'accepted' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Campaign Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {influencer.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendCollaboration(influencer.id)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Collaboration
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerCollaborationTools;
