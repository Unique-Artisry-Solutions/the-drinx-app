
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckCircle, User } from 'lucide-react';

interface Follower {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  subscription_start: string;
  subscription_end: string | null;
  created_at: string;
  updated_at: string;
  notification_preferences: Record<string, boolean>;
  follow_status: string;
  subscriber?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

const SubscriptionTab = () => {
  const { user } = useAuth();
  
  const { data: followers = [], isLoading } = useQuery({
    queryKey: ['promoterFollowers'],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Modified query to use proper join syntax for Supabase
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          subscriber:subscriber_id (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('promoter_id', user.id)
        .eq('follow_status', 'active');
        
      if (error) {
        console.error('Error fetching followers:', error);
        throw error;
      }
      
      // Type assertion to ensure proper typing of the result
      return (data || []) as Follower[];
    },
    enabled: !!user,
  });
  
  if (isLoading) {
    return <div className="p-8">Loading subscription data...</div>;
  }
  
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Subscribers</h2>
        
        <div className="grid gap-4">
          {followers.length > 0 ? (
            followers.map((follower) => (
              <Card key={follower.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {follower.subscriber?.avatar_url ? (
                      <img 
                        src={follower.subscriber.avatar_url} 
                        alt={follower.subscriber.display_name || 'User'} 
                        className="w-10 h-10 rounded-full" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">
                        {follower.subscriber?.display_name || 'Anonymous User'}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        <span>
                          Subscribed since {new Date(follower.subscription_start).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-success flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Active
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Subscribers Yet</CardTitle>
                <CardDescription>
                  You don't have any subscribers yet. Share your profile to gain followers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">Share Profile</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Subscription Settings</h2>
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Configure what your subscribers will be notified about.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Notification preferences would go here */}
            <p className="text-muted-foreground">Coming soon!</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default SubscriptionTab;
