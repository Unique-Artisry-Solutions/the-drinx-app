
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { usePaymentProvider } from '@/hooks/usePaymentProvider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import CheckoutContactForm from '@/components/checkout/CheckoutContactForm';
import CheckoutPaymentForm from '@/components/checkout/CheckoutPaymentForm';
import EmptyCartView from '@/components/checkout/EmptyCartView';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, CreditCard, User } from 'lucide-react';

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items, totalPrice, serviceFee, serviceFeePercentage, totalWithFees, clearCart } = useCart();
  const { isReady: isPaymentReady, isLoading: isPaymentLoading } = usePaymentProvider();
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'contact' | 'payment' | 'review'>('contact');

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setContactInfo(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  // Group items by type for better display
  const groupedItems = {
    subscriptions: items.filter(item => item.type === 'user' || item.type === 'establishment'),
    eventTickets: items.filter(item => item.type === 'event_ticket'),
    swigCircuitTickets: items.filter(item => item.type === 'swig_circuit_ticket')
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setContactInfo(prev => ({ ...prev, [id]: value }));
  };

  const handlePaymentMethodChange = (method: any) => {
    setPaymentMethod(method);
  };

  const validateContactInfo = () => {
    if (!contactInfo.firstName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your first name.",
        variant: "destructive"
      });
      return false;
    }
    if (!contactInfo.lastName.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter your last name.",
        variant: "destructive"
      });
      return false;
    }
    if (!contactInfo.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 'contact') {
      if (validateContactInfo()) {
        setStep('payment');
      }
    } else if (step === 'payment') {
      if (paymentMethod) {
        setStep('review');
      } else {
        toast({
          title: "Payment Method Required",
          description: "Please enter your payment information.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 'payment') {
      setStep('contact');
    } else if (step === 'review') {
      setStep('payment');
    }
  };

  const processTicketPurchase = async () => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-ticket-purchase', {
        body: {
          items,
          userId: user?.id || null,
          serviceFee,
          serviceFeePercentage,
          contactInfo: {
            name: `${contactInfo.firstName} ${contactInfo.lastName}`,
            email: contactInfo.email
          }
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Purchase Successful!",
          description: "Your tickets have been purchased successfully.",
          variant: "default"
        });
        
        clearCart();
        navigate('/purchase-success');
      } else {
        throw new Error(data?.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show empty cart if no items
  if (items.length === 0) {
    return (
      <Layout>
        <EmptyCartView />
      </Layout>
    );
  }

  // Show loading state while payment provider initializes
  if (isPaymentLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getStepIcon = (stepName: string) => {
    switch (stepName) {
      case 'contact':
        return <User className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'review':
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {['contact', 'payment', 'review'].map((stepName, index) => (
                <div
                  key={stepName}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    step === stepName
                      ? 'bg-spiritless-pink text-white'
                      : index < ['contact', 'payment', 'review'].indexOf(step)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {getStepIcon(stepName)}
                  <span className="capitalize font-medium">{stepName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {step === 'contact' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CheckoutContactForm
                      contactInfo={contactInfo}
                      onInputChange={handleContactInfoChange}
                    />
                  </CardContent>
                </Card>
              )}

              {step === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CheckoutPaymentForm
                      onPaymentMethodChange={handlePaymentMethodChange}
                    />
                  </CardContent>
                </Card>
              )}

              {step === 'review' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Contact Details</h4>
                      <p className="text-sm text-gray-600">
                        {contactInfo.firstName} {contactInfo.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{contactInfo.email}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600">
                        {paymentMethod?.card?.brand?.toUpperCase()} ending in {paymentMethod?.card?.last4}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={step === 'contact'}
                >
                  Previous
                </Button>
                
                {step !== 'review' ? (
                  <Button onClick={handleNextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={processTicketPurchase}
                    disabled={isProcessing || !isPaymentReady}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    {isProcessing ? 'Processing...' : `Complete Purchase ($${totalWithFees.toFixed(2)})`}
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
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
    </Layout>
  );
};

export default CheckoutPage;
