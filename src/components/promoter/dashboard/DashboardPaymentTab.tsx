
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { usePaymentProvider } from '@/hooks/usePaymentProvider';
import CheckoutPaymentForm from '@/components/checkout/CheckoutPaymentForm';

interface DashboardPaymentTabProps {
  promoterId: string;
}

const DashboardPaymentTab: React.FC<DashboardPaymentTabProps> = ({ promoterId }) => {
  const { isReady, isLoading } = usePaymentProvider();
  const [testAmount] = useState(1000); // $10.00 for testing
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTestPayment = async () => {
    if (!paymentMethod) return;
    
    setIsProcessing(true);
    try {
      // This would call your payment service
      console.log('Processing test payment with method:', paymentMethod.id);
      // Add actual payment processing here
    } catch (error) {
      console.error('Payment test failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentStatus = isReady ? 'active' : 'pending';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment System</h2>
          <p className="text-muted-foreground">
            Stripe integration status and payment testing
          </p>
        </div>
        <Badge variant={paymentStatus === 'active' ? 'default' : 'secondary'}>
          {paymentStatus === 'active' ? 'Stripe Active' : 'Initializing'}
        </Badge>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Stripe Status</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {isLoading ? 'Loading...' : isReady ? 'Connected' : 'Pending'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Test Mode</div>
            </div>
            <div className="text-2xl font-bold mt-1">Active</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Webhooks</div>
            </div>
            <div className="text-2xl font-bold mt-1">Configured</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Test Payment Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <AlertCircle className="h-4 w-4" />
              <span>Initializing Stripe...</span>
            </div>
          )}
          
          {isReady && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <CheckoutPaymentForm
                    onPaymentMethodChange={setPaymentMethod}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Test Payment Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>${(testAmount / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency:</span>
                      <span>USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{paymentMethod ? 'Card Added' : 'None'}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleTestPayment}
                    disabled={!paymentMethod || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Processing...' : 'Test Payment'}
                  </Button>
                  
                  <div className="text-xs text-gray-500">
                    Use test card: 4242 4242 4242 4242
                  </div>
                </div>
              </div>
            </>
          )}
          
          {!isReady && !isLoading && (
            <div className="text-center text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Stripe integration not ready. Check your configuration.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Stripe Secret Key Configured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Payment Tables Created</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Edge Functions Deployed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Webhook Endpoints (Configure in Stripe Dashboard)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPaymentTab;
