
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function InfluencerList() {
  const influencers = [
    { id: '1', name: 'Alice Johnson', influence: 85, followers: 1200 },
    { id: '2', name: 'Bob Smith', influence: 72, followers: 890 },
    { id: '3', name: 'Carol Davis', influence: 91, followers: 1580 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Influencers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {influencers.map((influencer) => (
            <div key={influencer.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{influencer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{influencer.name}</p>
                  <p className="text-sm text-muted-foreground">{influencer.followers} followers</p>
                </div>
              </div>
              <Badge variant={influencer.influence > 80 ? "default" : "secondary"}>
                {influencer.influence}% influence
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
