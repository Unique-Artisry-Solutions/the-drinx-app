
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import FollowersList from '@/components/subscription/FollowersList';
import SubscriptionList from '@/components/subscription/SubscriptionList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define proper interfaces for our data
interface Follower {
  id: string;
  created_at: string;
  follow_status: string;
  promoter_id: string;
  subscriber_id: string;
  notification_preferences: any;
  subscription_start: string;
  subscription_end: string | null;
  updated_at: string;
  subscriber: {
    id: string;
    display_name: string;
    avatar_url: string;
  } | null;
}

interface Subscription {
  id: string;
  created_at: string;
  follow_status: string;
  promoter_id: string;
  subscriber_id: string;
  notification_preferences: any;
  subscription_start: string;
  subscription_end: string | null;
  updated_at: string;
  promoter: {
    id: string;
    display_name: string;
    avatar_url: string;
  } | null;
}

const SubscriptionTab: React.FC = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchSubscriptionData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch followers
        const { data: followersData, error: followersError } = await supabase
          .from('promoter_followers')
          .select('*, subscriber:profiles!subscriber_id(*)')
          .eq('promoter_id', user.id);
        
        if (followersError) {
          console.error('Error fetching followers:', followersError);
        } else if (followersData) {
          // Make sure we have all the necessary properties
          const processedFollowers = followersData.map(follower => {
            // Ensure subscriber has all required fields
            const subscriber = follower.subscriber && typeof follower.subscriber === 'object' 
              ? {
                  id: follower.subscriber.id || '',
                  display_name: follower.subscriber.display_name || 'Anonymous User',
                  avatar_url: follower.subscriber.avatar_url || ''
                }
              : {
                  id: '',
                  display_name: 'Anonymous User',
                  avatar_url: ''
                };
            
            return {
              ...follower,
              subscriber
            };
          });
          
          setFollowers(processedFollowers as Follower[]);
        }
        
        // Fetch subscriptions
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('promoter_followers')
          .select('*, promoter:profiles!promoter_id(*)')
          .eq('subscriber_id', user.id);
        
        if (subscriptionsError) {
          console.error('Error fetching subscriptions:', subscriptionsError);
        } else if (subscriptionsData) {
          // Make sure we have all the necessary properties
          const processedSubscriptions = subscriptionsData.map(subscription => {
            // Ensure promoter has all required fields
            const promoter = subscription.promoter && typeof subscription.promoter === 'object'
              ? {
                  id: subscription.promoter.id || '',
                  display_name: subscription.promoter.display_name || 'Unknown Promoter',
                  avatar_url: subscription.promoter.avatar_url || ''
                }
              : {
                  id: '',
                  display_name: 'Unknown Promoter',
                  avatar_url: ''
                };
            
            return {
              ...subscription,
              promoter
            };
          });
          
          setSubscriptions(processedSubscriptions as Subscription[]);
        }
      } catch (error) {
        console.error('Exception in fetchSubscriptionData:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscriptionData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscriptions & Followers</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscriptions to promoters and view your followers
        </p>
      </div>
      
      <Tabs defaultValue="subscriptions">
        <TabsList>
          <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
          <TabsTrigger value="followers">My Followers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions">
          <SubscriptionList 
            subscriptions={subscriptions.map(subscription => ({
              id: subscription.id,
              promoter: {
                id: subscription.promoter?.id || '',
                display_name: subscription.promoter?.display_name || 'Unknown Promoter',
                avatar_url: subscription.promoter?.avatar_url || ''
              },
              subscription_start: subscription.subscription_start,
              follow_status: subscription.follow_status
            }))}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="followers">
          <FollowersList 
            followers={followers.map(follower => ({
              id: follower.id,
              subscriber: {
                id: follower.subscriber?.id || '',
                display_name: follower.subscriber?.display_name || 'Anonymous User',
                avatar_url: follower.subscriber?.avatar_url || ''
              },
              subscription_start: follower.subscription_start,
              follow_status: follower.follow_status
            }))}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionTab;
