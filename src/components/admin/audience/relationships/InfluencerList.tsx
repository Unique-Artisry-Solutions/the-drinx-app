import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, TrendingUp, MessageCircle } from 'lucide-react';

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  influenceScore: number;
  engagement: number;
  tier: 'bronze' | 'silver' | 'gold';
}

interface InfluencerListProps {
  influencers: Influencer[];
}

const InfluencerList = ({ influencers }: InfluencerListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Influencers</CardTitle>
        <CardDescription>
          Users with the highest influence scores in your audience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {influencers.map((influencer) => (
            <div key={influencer.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={influencer.avatar} />
                  <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{influencer.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{influencer.followers.toLocaleString()} followers</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Influence Score: {influencer.influenceScore}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>{influencer.engagement}% engagement</span>
                  </div>
                </div>
                
                <Badge variant={influencer.tier === 'gold' ? 'default' : 'secondary'}>
                  {influencer.tier}
                </Badge>
                
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerList;
