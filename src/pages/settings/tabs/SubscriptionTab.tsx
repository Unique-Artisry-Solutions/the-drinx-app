
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users } from "lucide-react";
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

// Placeholder hook implementation
const useSubscriptions = () => {
  // In a real implementation, this would fetch data from an API
  return {
    followers: [
      {
        id: '1',
        subscriber: {
          id: '123',
          display_name: 'John Doe',
          avatar_url: '/images/avatar1.jpg',
        },
        subscription_start: new Date().toISOString(),
      },
      {
        id: '2',
        subscriber: {
          id: '456',
          display_name: 'Jane Smith',
          avatar_url: '/images/avatar2.jpg',
        },
        subscription_start: new Date().toISOString(),
      }
    ],
    subscriptions: [
      {
        id: '1',
        promoter: {
          id: '789',
          display_name: 'Club XYZ',
          avatar_url: '/images/club1.jpg',
        },
        subscription_start: new Date().toISOString(),
        tier: { name: 'Premium' },
      }
    ],
    isLoading: false,
    error: null,
  };
};

const SubscriptionTab: React.FC = () => {
  const { user } = useAuth();
  const { followers, subscriptions, isLoading } = useSubscriptions();

  if (isLoading) {
    return <div>Loading subscriptions...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Followers</h2>
        
        {followers && followers.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {followers.map(follower => (
              <Card key={follower.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {follower.subscriber?.avatar_url && (
                        <img 
                          src={follower.subscriber.avatar_url} 
                          alt={follower.subscriber?.display_name || 'Subscriber'} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{follower.subscriber?.display_name || 'Unknown User'}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        <span>
                          Following since {follower.subscription_start ? 
                            format(new Date(follower.subscription_start), 'MMM d, yyyy') : 
                            'Unknown date'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg mb-1">No Followers Yet</h3>
              <p className="text-muted-foreground mb-4">
                When people follow you, they will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
        
        {subscriptions && subscriptions.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {subscriptions.map(subscription => (
              <Card key={subscription.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{subscription.promoter?.display_name || 'Unknown Promoter'}</CardTitle>
                    {subscription.tier && (
                      <Badge>{subscription.tier.name}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>
                      Subscribed since {subscription.subscription_start ? 
                        format(new Date(subscription.subscription_start), 'MMM d, yyyy') : 
                        'Unknown date'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">Manage Subscription</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg mb-1">No Active Subscriptions</h3>
              <p className="text-muted-foreground mb-4">
                You haven't subscribed to any promoters yet.
              </p>
              <Button>Browse Promoters</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubscriptionTab;
