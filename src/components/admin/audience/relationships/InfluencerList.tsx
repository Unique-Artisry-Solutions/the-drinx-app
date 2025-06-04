
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfluentialUser } from '@/types/AudienceTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp } from 'lucide-react';

export interface InfluencerListProps {
  influencers: InfluentialUser[];
  onSelectUser: (userId: string) => void;
}

export const InfluencerList: React.FC<InfluencerListProps> = ({ influencers, onSelectUser }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Influencers</CardTitle>
        <CardDescription>
          Most influential users in your audience network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {influencers.length === 0 ? (
            <p className="text-muted-foreground">No influencers data available.</p>
          ) : (
            influencers.map((influencer) => (
              <div key={influencer.user_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{influencer.display_name || 'Anonymous User'}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Influence Score: {influencer.influence_score}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4" />
                        {influencer.follower_count} followers
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        {influencer.engagement_rate}% engagement
                      </Badge>
                      <Badge variant="outline">
                        {influencer.connected_segments} segments
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectUser(influencer.user_id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerList;
