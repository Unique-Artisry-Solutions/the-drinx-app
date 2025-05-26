import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useCart } from '@/contexts/CartContext';
import { usePaymentProvider } from '@/hooks/usePaymentProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CheckoutContactForm from '@/components/checkout/CheckoutContactForm';
import CheckoutPaymentForm from '@/components/checkout/CheckoutPaymentForm';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import { Loader2 } from 'lucide-react';

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
}

const CheckoutPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearCart, totalPrice, serviceFee, serviceFeePercentage, totalWithFees } = useCart();
  const { stripe, isReady } = usePaymentProvider();
  const { toast } = useToast();

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || ''
  });
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | undefined>();

  // Group items by type for better organization
  const groupedItems = {
    subscriptions: items.filter(item => item.type === 'user' || item.type === 'establishment'),
    eventTickets: items.filter(item => item.type === 'event_ticket'),
    swigCircuitTickets: items.filter(item => item.type === 'swig_circuit_ticket')
  };

  // Auto-populate user info if logged in
  useEffect(() => {
    if (user?.email && !contactInfo.email) {
      setContactInfo(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user, contactInfo.email]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [items.length, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePaymentMethodChange = (newPaymentMethod: any) => {
    setPaymentMethod(newPaymentMethod);
    setPaymentError(undefined);
  };

  const validateForm = (): boolean => {
    if (!contactInfo.firstName.trim()) {
      toast({
        title: "First name required",
        description: "Please enter your first name.",
        variant: "destructive"
      });
      return false;
    }
    if (!contactInfo.lastName.trim()) {
      toast({
        title: "Last name required", 
        description: "Please enter your last name.",
        variant: "destructive"
      });
      return false;
    }
    if (!contactInfo.email.trim() || !contactInfo.email.includes('@')) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please enter your payment information.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !stripe) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(undefined);

    try {
      // Process the ticket purchase
      const { data, error } = await supabase.functions.invoke('process-ticket-purchase', {
        body: {
          items,
          userId: user?.id || null,
          serviceFee,
          serviceFeePercentage,
          contactInfo: {
            name: `${contactInfo.firstName} ${contactInfo.lastName}`,
            email: contactInfo.email
          },
          paymentMethodId: paymentMethod.id
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        // Clear cart and redirect to success page
        clearCart();
        
        toast({
          title: "Purchase successful!",
          description: "Your tickets have been purchased successfully. Check your email for confirmation.",
        });

        navigate('/purchase-success', { 
          state: { 
            purchaseDetails: data.data,
            contactEmail: contactInfo.email 
          } 
        });
      } else {
        throw new Error(data.error || 'Purchase failed');
      }

    } catch (error) {
      console.error('Purchase error:', error);
      setPaymentError(error instanceof Error ? error.message : 'An error occurred during purchase');
      
      toast({
        title: "Purchase failed",
        description: error instanceof Error ? error.message : 'An error occurred during purchase',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isReady) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading payment system...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CheckoutContactForm 
                    contactInfo={contactInfo}
                    onInputChange={handleInputChange}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CheckoutPaymentForm 
                    onPaymentMethodChange={handlePaymentMethodChange}
                    error={paymentError}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <CheckoutSummary
                groupedItems={groupedItems}
                totalPrice={totalPrice}
                serviceFee={serviceFee}
                serviceFeePercentage={serviceFeePercentage}
                totalWithFees={totalWithFees}
              />

              <Card>
                <CardContent className="pt-6">
                  <Button 
                    onClick={handleSubmit}
                    disabled={isProcessing || !paymentMethod}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      `Complete Purchase - $${totalWithFees.toFixed(2)}`
                    )}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center mt-4">
                    By completing your purchase, you agree to our terms of service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
