
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Stepper } from '@/components/ui/stepper';
import { ArrowLeft, ArrowRight, CreditCard, User, CheckCircle } from 'lucide-react';
import CheckoutContactForm from '@/components/checkout/CheckoutContactForm';
import CheckoutPaymentForm from '@/components/checkout/CheckoutPaymentForm';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import EmptyCartView from '@/components/checkout/EmptyCartView';

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, serviceFee, serviceFeePercentage, totalWithFees, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || ''
  });
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-fill contact info for authenticated users
  useEffect(() => {
    if (user?.email) {
      setContactInfo(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user]);

  // Show empty cart view if no items
  if (items.length === 0) {
    return <EmptyCartView isLoggedIn={isAuthenticated} />;
  }

  // Group items by type for display
  const groupedItems = {
    subscriptions: items.filter(item => item.type === 'user' || item.type === 'establishment'),
    eventTickets: items.filter(item => item.type === 'event_ticket'),
    swigCircuitTickets: items.filter(item => item.type === 'swig_circuit_ticket')
  };

  const steps = [
    { title: 'Contact Info', icon: User },
    { title: 'Payment', icon: CreditCard },
    { title: 'Review', icon: CheckCircle }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      // Validate contact info
      if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all contact information fields.',
          variant: 'destructive'
        });
        return;
      }
    }
    
    if (currentStep === 1) {
      // Validate payment method
      if (!paymentMethod) {
        toast({
          title: 'Payment Required',
          description: 'Please enter your payment information.',
          variant: 'destructive'
        });
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Process the payment with our ticket purchase service
      const purchaseData = {
        items: items.map(item => ({
          id: item.id,
          type: item.type,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          eventId: item.eventId,
          swigCircuitId: item.swigCircuitId,
          ticketTypeId: item.ticketTypeId,
          date: item.date,
          time: item.time,
          venue: item.venue
        })),
        userId: user?.id || null,
        serviceFee,
        serviceFeePercentage,
        contactInfo: {
          name: `${contactInfo.firstName} ${contactInfo.lastName}`,
          email: contactInfo.email
        }
      };

      const { data, error } = await fetch('/api/process-ticket-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData)
      }).then(res => res.json());

      if (error) {
        throw new Error(error);
      }

      // Clear cart and redirect to success page
      clearCart();
      navigate('/purchase-success');
      
      toast({
        title: 'Purchase Successful!',
        description: 'Your tickets have been purchased successfully.',
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <CheckoutContactForm 
              contactInfo={contactInfo}
              onInputChange={handleInputChange}
            />
            {!isAuthenticated && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Guest Checkout:</strong> You're checking out as a guest. 
                  Your tickets will be sent to the email address provided.
                </p>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <CheckoutPaymentForm 
            onPaymentMethodChange={setPaymentMethod}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            <CheckoutSummary 
              groupedItems={groupedItems}
              totalPrice={totalPrice}
              serviceFee={serviceFee}
              serviceFeePercentage={serviceFeePercentage}
              totalWithFees={totalWithFees}
            />
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">Order Confirmation</h4>
              <p className="text-sm text-green-700">
                Your order will be processed and confirmation emails will be sent to{' '}
                <strong>{contactInfo.email}</strong>
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Stepper 
                  steps={steps.map((step, index) => ({
                    title: step.title,
                    completed: index < currentStep,
                    active: index === currentStep
                  }))}
                  currentStep={currentStep}
                />
                
                <div className="mt-6">
                  {renderStepContent()}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep < steps.length - 1 ? (
                    <Button onClick={handleNextStep}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleProcessPayment}
                      disabled={isProcessing}
                      className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                    >
                      {isProcessing ? 'Processing...' : `Pay $${totalWithFees.toFixed(2)}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
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
    </Layout>
  );
};

export default CheckoutPage;
