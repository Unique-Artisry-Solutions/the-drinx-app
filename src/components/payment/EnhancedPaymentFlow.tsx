
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Shield, Smartphone, Calendar, BarChart3 } from 'lucide-react';
import SecurePaymentForm from './SecurePaymentForm';
import DigitalWalletPayment from './DigitalWalletPayment';
import PaymentInstallments from './PaymentInstallments';
import PaymentAnalytics from './PaymentAnalytics';
import { useToast } from '@/hooks/use-toast';

interface EnhancedPaymentFlowProps {
  amount: number;
  currency?: string;
  description: string;
  onPaymentComplete?: (paymentData: any) => void;
  showAnalytics?: boolean;
}

const EnhancedPaymentFlow: React.FC<EnhancedPaymentFlowProps> = ({
  amount,
  currency = 'USD',
  description,
  onPaymentComplete,
  showAnalytics = false
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('payment');
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);

  const finalAmount = selectedInstallment ? selectedInstallment.monthlyAmount : amount;
  const paymentLabel = selectedInstallment 
    ? `${description} - Installment 1 of ${selectedInstallment.periods}`
    : description;

  const handlePaymentSuccess = (method: any) => {
    setPaymentMethod(method);
    
    const paymentData = {
      paymentMethod: method,
      amount: finalAmount,
      currency,
      description: paymentLabel,
      installment: selectedInstallment,
      timestamp: new Date().toISOString()
    };

    onPaymentComplete?.(paymentData);
    
    toast({
      title: "Payment successful!",
      description: selectedInstallment 
        ? `First installment of $${finalAmount.toFixed(2)} processed successfully.`
        : `Payment of $${finalAmount.toFixed(2)} processed successfully.`,
    });
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive"
    });
  };

  const handleExportAnalytics = () => {
    // Mock export functionality
    toast({
      title: "Export started",
      description: "Your payment analytics report will be downloaded shortly.",
    });
  };

  if (showAnalytics) {
    return <PaymentAnalytics onExportData={handleExportAnalytics} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-medium">{description}</p>
              <p className="text-sm text-gray-600">{currency}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                ${finalAmount.toFixed(2)}
              </p>
              {selectedInstallment && (
                <p className="text-sm text-blue-600">
                  Total: ${selectedInstallment.totalAmount.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Secure Payment
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Digital Wallet
          </TabsTrigger>
          <TabsTrigger value="installments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Installments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="space-y-4">
          <SecurePaymentForm
            amount={finalAmount}
            currency={currency}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            isProcessing={isProcessing}
          />
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <DigitalWalletPayment
            amount={finalAmount}
            currency={currency.toLowerCase()}
            label={paymentLabel}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
          <Separator />
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Or pay with traditional card payment
            </p>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('payment')}
            >
              Use Card Payment
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="installments" className="space-y-4">
          <PaymentInstallments
            totalAmount={amount}
            onInstallmentSelected={setSelectedInstallment}
            selectedInstallment={selectedInstallment}
          />
          
          {selectedInstallment && (
            <div className="mt-4">
              <Button 
                onClick={() => setActiveTab('payment')}
                className="w-full"
              >
                Continue with Installment Payment
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Security Notice */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-600" />
            <span>
              Payments are secured by 256-bit SSL encryption and processed by Stripe. 
              Your payment information is never stored on our servers.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPaymentFlow;
