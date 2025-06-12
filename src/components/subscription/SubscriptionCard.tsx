
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, CheckCircle } from 'lucide-react';
import { FollowerData } from '@/hooks/useFollowers';

interface SubscriptionCardProps {
  subscription: FollowerData;
  onUpgrade?: () => void;
  onCancel?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  subscription, 
  onUpgrade, 
  onCancel 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            {subscription.tier_name || 'Free Tier'}
          </div>
          <Badge variant={subscription.follow_status === 'active' ? 'default' : 'secondary'}>
            {subscription.follow_status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Started</div>
            <div>{formatDate(subscription.created_at)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Active
            </div>
          </div>
        </div>
        
        {subscription.tier_name === 'Free' && (
          <div className="pt-4 border-t">
            <Button onClick={onUpgrade} className="w-full">
              Upgrade to Premium
            </Button>
          </div>
        )}
        
        {subscription.follow_status === 'active' && (
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={onCancel} className="w-full">
              Manage Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
