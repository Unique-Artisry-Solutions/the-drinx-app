
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TopNavigation from '@/components/TopNavigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useAnalytics } from '@/hooks/useAnalytics';
import BackButton from '@/components/navigation/BackButton';

// Import the new component files
import EmptyCartView from '@/components/checkout/EmptyCartView';
import CheckoutContactForm from '@/components/checkout/CheckoutContactForm';
import CheckoutPaymentForm from '@/components/checkout/CheckoutPaymentForm';
import CheckoutVerification from '@/components/checkout/CheckoutVerification';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
}

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, serviceFee, serviceFeePercentage, totalWithFees, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { trackServiceFee } = useAnalytics();

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    // Only allow form submission if captcha is verified
    setFormValid(!!value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setContactInfo(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaValue) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA verification",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Filter only ticket items
      const ticketItems = items.filter(item => 
        item.type === 'event_ticket' || item.type === 'swig_circuit_ticket'
      );

      // Process ticket purchases if there are any ticket items
      if (ticketItems.length > 0) {
        const { data, error } = await supabase.functions.invoke('process-ticket-purchase', {
          body: {
            items: ticketItems,
            userId: user?.id,
            serviceFee: serviceFee,
            serviceFeePercentage: serviceFeePercentage,
            contactInfo: {
              name: `${contactInfo.firstName} ${contactInfo.lastName}`,
              email: contactInfo.email
            }
          }
        });
        
        if (error) {
          toast({
            title: 'Error Processing Tickets',
            description: error.message || 'Something went wrong while processing your tickets.',
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }
        
        if (data && !data.success) {
          toast({
            title: 'Error Processing Tickets',
            description: data.error || 'Something went wrong while processing your tickets.',
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }
      }
      
      // Track service fee collection 
      await trackServiceFee(serviceFee, serviceFeePercentage, totalWithFees);
      
      // Simulate payment processing for all items
      // In a real implementation, you'd have Stripe or another payment processor here
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: 'Payment Successful',
          description: 'Thank you for your purchase!',
        });
        clearCart();
        navigate('/purchase-confirmation', { 
          state: { 
            items, 
            serviceFee,
            serviceFeePercentage,
            totalWithFees,
            contactInfo: {
              name: `${contactInfo.firstName} ${contactInfo.lastName}`,
              email: contactInfo.email
            }
          } 
        });
      }, 2000);
      
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50">
        <TopNavigation />
        <EmptyCartView isLoggedIn={!!user} />
      </div>
    );
  }

  // Group items by type for the summary
  const groupedItems = {
    subscriptions: items.filter(item => item.type === 'user' || item.type === 'establishment'),
    eventTickets: items.filter(item => item.type === 'event_ticket'),
    swigCircuitTickets: items.filter(item => item.type === 'swig_circuit_ticket')
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50">
      <TopNavigation />
      <div className="container max-w-6xl mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton 
              fallbackPath="/pricing" 
              variant="ghost" 
              size="sm"
              label="Back" 
              showLabel={true}
            />
            <h1 className="text-2xl font-semibold">Checkout</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <CheckoutContactForm 
                    contactInfo={contactInfo} 
                    onInputChange={handleInputChange} 
                  />

                  <CheckoutPaymentForm />
                  
                  <CheckoutVerification 
                    captchaValue={captchaValue}
                    handleCaptchaChange={handleCaptchaChange}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isProcessing || !formValid}
                  >
                    {isProcessing ? 'Processing...' : 'Complete Payment'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div>
            <CheckoutSummary 
              groupedItems={groupedItems}
              totalPrice={totalPrice}
              serviceFee={serviceFee}
              serviceFeePercentage={serviceFeePercentage}
              totalWithFees={totalWithFees}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
