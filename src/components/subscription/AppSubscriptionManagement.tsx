
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, CreditCard, Settings, X } from 'lucide-react';
import { useAppSubscription } from '@/hooks/useAppSubscription';
import { format } from 'date-fns';

export const AppSubscriptionManagement: React.FC = () => {
  const { 
    userSubscription, 
    hasActiveSubscription, 
    cancelSubscription, 
    checkStatus 
  } = useAppSubscription();

  const handleManagePayment = () => {
    // This would open Stripe Customer Portal
    window.open('/customer-portal', '_blank');
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your current billing period.')) {
      cancelSubscription.mutate();
    }
  };

  if (!hasActiveSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You don't have an active subscription. Subscribe to access all app features.
          </p>
          <Button onClick={() => window.location.href = '/pricing'}>
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Subscription
            <Badge 
              variant={userSubscription?.status === 'active' ? 'default' : 'secondary'}
              className={userSubscription?.status === 'active' ? 'bg-green-600' : ''}
            >
              {userSubscription?.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Current Period
              </div>
              <p className="text-sm">
                {userSubscription?.subscription_start && (
                  <>
                    {format(new Date(userSubscription.subscription_start), 'MMM d, yyyy')} - {' '}
                    {userSubscription.subscription_end ? format(new Date(userSubscription.subscription_end), 'MMM d, yyyy') : 'Ongoing'}
                  </>
                )}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard className="h-4 w-4 mr-2" />
                Plan
              </div>
              <p className="text-sm font-medium">
                {userSubscription?.subscription_type === 'basic' ? 'Basic Plan' : 'Premium Plan'}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={handleManagePayment}
              className="flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Payment
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => checkStatus.mutate()}
              disabled={checkStatus.isPending}
            >
              {checkStatus.isPending ? 'Checking...' : 'Refresh Status'}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={cancelSubscription.isPending}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              {cancelSubscription.isPending ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>✅ Access to all app features</p>
            <p>✅ Follow unlimited promoters</p>
            <p>✅ Receive notifications and updates</p>
            <p>✅ Event discovery and participation</p>
            {userSubscription?.subscription_type === 'premium' && (
              <>
                <p>✅ Advanced analytics</p>
                <p>✅ Priority support</p>
                <p>✅ Early access to new features</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppSubscriptionManagement;
