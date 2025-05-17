
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
  subscription_end: string;
  updated_at: string;
  subscriber: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
}

interface Subscription {
  id: string;
  created_at: string;
  follow_status: string;
  promoter_id: string;
  subscriber_id: string;
  notification_preferences: any;
  subscription_start: string;
  subscription_end: string;
  updated_at: string;
  promoter: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
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
      
      // Fetch followers
      const { data: followersData, error: followersError } = await supabase
        .from('promoter_subscribers')
        .select('*, subscriber:profiles!subscriber_id(*)')
        .eq('promoter_id', user.id);
      
      if (followersError) {
        console.error('Error fetching followers:', followersError);
      } else {
        // Type cast the followers data
        setFollowers((followersData as unknown) as Follower[]);
      }
      
      // Fetch subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('promoter_subscribers')
        .select('*, promoter:profiles!promoter_id(*)')
        .eq('subscriber_id', user.id);
      
      if (subscriptionsError) {
        console.error('Error fetching subscriptions:', subscriptionsError);
      } else {
        // Type cast the subscriptions data
        setSubscriptions((subscriptionsData as unknown) as Subscription[]);
      }
      
      setIsLoading(false);
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
            subscriptions={subscriptions} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="followers">
          <FollowersList 
            followers={followers}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionTab;
