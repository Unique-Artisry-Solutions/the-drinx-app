
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, Crown } from 'lucide-react';
import { useAppSubscription } from '@/hooks/useAppSubscription';
import { AppSubscriptionPlan } from '@/services/StandardSubscriptionService';

interface AppSubscriptionPlansProps {
  onPlanSelect?: (planId: string) => void;
}

export const AppSubscriptionPlans: React.FC<AppSubscriptionPlansProps> = ({
  onPlanSelect
}) => {
  const { 
    plans, 
    userSubscription, 
    hasActiveSubscription, 
    createSubscription, 
    isLoading 
  } = useAppSubscription();

  const handleSelectPlan = (planId: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    } else {
      createSubscription.mutate(planId);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">
          Select a subscription plan to access the Swig app and all its features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = userSubscription?.subscription_type === plan.id;
          const isPremium = plan.id === 'premium';
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${isPremium ? 'border-2 border-purple-300' : ''} ${
                isCurrentPlan ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {isPremium && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-3 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                  {plan.name}
                  {isCurrentPlan && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Current
                    </Badge>
                  )}
                </CardTitle>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || createSubscription.isPending}
                  className={`w-full ${isPremium ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                >
                  {createSubscription.isPending
                    ? 'Processing...'
                    : isCurrentPlan
                    ? 'Current Plan'
                    : hasActiveSubscription
                    ? 'Switch Plan'
                    : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {hasActiveSubscription && (
        <div className="text-center text-sm text-gray-600">
          <p>
            You have an active {userSubscription?.subscription_type} subscription. 
            You can switch plans or manage your subscription at any time.
          </p>
        </div>
      )}
    </div>
  );
};

export default AppSubscriptionPlans;
