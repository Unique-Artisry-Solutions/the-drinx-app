
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { AppSubscription } from '@/types/SubscriptionTypes';

interface SubscriptionManagementProps {
  isLightTheme?: boolean;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ isLightTheme = false }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('plans');
  const { subscriptions, loading, refetch, subscribe, unsubscribe } = useSubscriptions();
  
  // Define predefined subscription tiers since useSubscriptions doesn't return tiers by default
  const predefinedTiers = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Get started with essential tools',
      price: 9.99,
      features: ['Event Creation', 'Basic Analytics', 'Email Support'],
      is_default: true
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Enhanced tools for growing promoters',
      price: 24.99,
      features: ['Event Creation', 'Advanced Analytics', 'Priority Support', 'Marketing Tools', 'Custom Branding'],
      is_default: false
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Complete suite for professional promoters',
      price: 49.99,
      features: ['Event Creation', 'Premium Analytics', 'Dedicated Support', 'Advanced Marketing', 'Custom Branding', 'Audience Segmentation', 'API Access'],
      is_default: false
    }
  ];

  if (loading) {
    return <div className="flex justify-center p-8">Loading subscription information...</div>;
  }

  const handleSubscribe = async (tierId: string) => {
    if (!user) return;
    try {
      await subscribe.mutateAsync({ promoterId: user.id, tierId });
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const handleUnsubscribe = async (subscriptionId: string) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await unsubscribe.mutateAsync(subscriptionId);
      } catch (error) {
        console.error('Unsubscribe error:', error);
      }
    }
  };

  const activeSubscription = subscriptions?.find(sub => sub.status === 'active');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${isLightTheme ? 'text-gray-800' : ''}`}>
          Subscription Management
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="current">Current Plan</TabsTrigger>
            <TabsTrigger value="history">Subscription History</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {predefinedTiers.map((tier) => {
                const isCurrentPlan = activeSubscription?.subscription_type === tier.id.toLowerCase();
                
                return (
                  <Card key={tier.id} className={`${isCurrentPlan ? 'border-2 border-purple-500' : ''}`}>
                    <CardHeader>
                      <CardTitle>{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">
                        ${tier.price.toFixed(2)}
                        <span className="text-sm text-muted-foreground ml-1">/month</span>
                      </div>
                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={isCurrentPlan || subscribe.isPending}
                        onClick={() => !isCurrentPlan && handleSubscribe(tier.id)}
                      >
                        {isCurrentPlan 
                          ? 'Current Plan' 
                          : subscribe.isPending 
                            ? 'Processing...' 
                            : 'Subscribe'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="current">
            {activeSubscription ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeSubscription.subscription_type.charAt(0).toUpperCase() + activeSubscription.subscription_type.slice(1)} Plan
                  </CardTitle>
                  <CardDescription>
                    Your current subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Subscription Start</h3>
                      <p>{new Date(activeSubscription.subscription_start).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Renewal Date</h3>
                      <p>
                        {activeSubscription.subscription_end 
                          ? new Date(activeSubscription.subscription_end).toLocaleDateString() 
                          : 'Auto-renews monthly'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <p className="capitalize">{activeSubscription.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                      <p>{activeSubscription.payment_provider || 'Standard Payment'}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Update Payment Method</Button>
                  <Button 
                    variant="destructive" 
                    disabled={unsubscribe.isPending}
                    onClick={() => handleUnsubscribe(activeSubscription.id)}
                  >
                    {unsubscribe.isPending ? 'Processing...' : 'Cancel Subscription'}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <X className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Active Subscription</h3>
                <p className="text-muted-foreground mb-6">
                  You don't currently have an active subscription plan.
                </p>
                <Button onClick={() => setActiveTab('plans')}>View Plans</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {subscriptions && subscriptions.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Subscription Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        End Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {subscriptions.map((subscription: AppSubscription) => (
                      <tr key={subscription.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="capitalize">{subscription.subscription_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(subscription.subscription_start).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subscription.subscription_end 
                            ? new Date(subscription.subscription_end).toLocaleDateString() 
                            : 'Active'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${subscription.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : subscription.status === 'cancelled' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`
                          }>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium">No Subscription History</h3>
                <p className="text-muted-foreground">You don't have any previous subscription records.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
