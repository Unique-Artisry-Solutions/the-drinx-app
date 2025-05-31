import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageCircle } from 'lucide-react';

interface Influencer {
  id: string;
  name: string;
  avatar?: string;
  followerCount: number;
  engagementRate: number;
  reachPotential: number;
  categories: string[];
}

interface InfluencerListProps {
  influencers: Influencer[];
  onContactInfluencer?: (influencerId: string) => void;
}

export function InfluencerList({ influencers, onContactInfluencer }: InfluencerListProps) {
  // Mock influencer data - preserved as placeholder
  const mockInfluencers: Influencer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      followerCount: 15000,
      engagementRate: 8.5,
      reachPotential: 92,
      categories: ['Cocktails', 'Lifestyle']
    },
    {
      id: '2',
      name: 'Mike Chen',
      followerCount: 8500,
      engagementRate: 12.3,
      reachPotential: 87,
      categories: ['Food', 'Drinks']
    }
  ];

  const displayInfluencers = influencers.length > 0 ? influencers : mockInfluencers;

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Key Influencers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayInfluencers.map((influencer) => (
            <div key={influencer.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={influencer.avatar} />
                  <AvatarFallback>
                    {influencer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-medium">{influencer.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFollowerCount(influencer.followerCount)} followers
                  </div>
                  <div className="flex gap-1 mt-1">
                    {influencer.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-center">
                    <div className="text-sm font-medium">{influencer.engagementRate}%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{influencer.reachPotential}%</div>
                    <div className="text-xs text-muted-foreground">Reach</div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onContactInfluencer?.(influencer.id)}
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="h-3 w-3" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
