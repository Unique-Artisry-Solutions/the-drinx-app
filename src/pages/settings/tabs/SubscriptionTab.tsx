
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppSubscription } from '@/hooks/useAppSubscription';
import { useFollowers } from '@/hooks/useFollowers';

interface SubscriptionTabProps {
  isLightTheme: boolean;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ isLightTheme }) => {
  const { subscription, isLoading: isLoadingSubscription, cancelSubscription } = useAppSubscription();
  const { followedPromoters, isLoading: isLoadingFollowing } = useFollowers();
  
  const isLoading = isLoadingSubscription || isLoadingFollowing;
  
  const handleCancelSubscription = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      await cancelSubscription.mutateAsync();
    }
  };
  
  return (
    <TabsContent value="subscriptions">
      <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
        <CardHeader>
          <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
            App Subscription
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Manage your app subscription settings and preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className={cn(
              "rounded-lg border p-4",
              isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-2", 
                isLightTheme ? "text-gray-800" : ""
              )}>
                Current Plan: {isLoading ? "Loading..." : (subscription?.subscription_type ? subscription.subscription_type.charAt(0).toUpperCase() + subscription.subscription_type.slice(1) : "Free")}
              </h3>
              <p className={cn(
                "text-sm mb-4",
                isLightTheme ? "text-gray-600" : ""
              )}>
                {!isLoading && !subscription?.subscription_type && "You're currently on the free plan with limited features."}
                {!isLoading && subscription?.subscription_type && `You're on the ${subscription.subscription_type} plan.`}
              </p>
              {!isLoading && !subscription?.subscription_type && (
                <Button variant="outline" className={isLightTheme ? "border-gray-300" : ""}>
                  Upgrade to Premium
                </Button>
              )}
              {!isLoading && subscription && subscription.subscription_type !== 'free' && (
                <Button 
                  variant="outline" 
                  className={isLightTheme ? "border-gray-300 text-red-600 hover:bg-red-50" : "text-red-400 hover:bg-red-900/20"}
                  onClick={handleCancelSubscription}
                  disabled={cancelSubscription.isPending}
                >
                  {cancelSubscription.isPending ? 'Processing...' : 'Cancel Subscription'}
                </Button>
              )}
            </div>
            
            <div className={cn(
              "rounded-lg border p-4",
              isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-2", 
                isLightTheme ? "text-gray-800" : ""
              )}>
                Promoters You Follow
              </h3>
              {isLoadingFollowing ? (
                <p>Loading your followed promoters...</p>
              ) : followedPromoters.length === 0 ? (
                <p className="text-sm text-muted-foreground">You're not following any promoters yet.</p>
              ) : (
                <div className="space-y-2">
                  {followedPromoters.map((follower) => (
                    <div key={follower.id} className="flex justify-between items-center p-2 border-b">
                      <span>{follower.promoter?.display_name || 'Unknown Promoter'}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {/* Navigate to promoter page */}}
                        className="text-xs"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SubscriptionTab;
