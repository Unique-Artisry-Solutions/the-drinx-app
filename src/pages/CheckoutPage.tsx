
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import TopNavigation from '@/components/TopNavigation';
import CartButton from '@/components/cart/CartButton';
import ReCAPTCHA from 'react-google-recaptcha';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAnalytics } from '@/hooks/useAnalytics';
import BackButton from '@/components/navigation/BackButton';
import CartItem from '@/components/cart/CartItem';

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
}

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, serviceFee, serviceFeePercentage, totalWithFees, clearCart, removeItem } = useCart();
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
        <div className="container max-w-6xl mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some plans to your cart before checking out.</p>
          <Link to="/pricing">
            <Button>View Plans</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate navigation links based on cart items
  const getDetailLink = (item: typeof items[0]) => {
    if (item.type === 'event_ticket' && item.eventId) {
      return `/event/${item.eventId}`;
    } else if (item.type === 'swig_circuit_ticket' && item.swigCircuitId) {
      return `/swig-circuit/${item.swigCircuitId}`;
    }
    return '';
  };

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
                  <div className="space-y-2">
                    <h3 className="font-medium">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="firstName">
                          First Name
                        </label>
                        <Input 
                          id="firstName" 
                          placeholder="First Name" 
                          required 
                          value={contactInfo.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="lastName">
                          Last Name
                        </label>
                        <Input 
                          id="lastName" 
                          placeholder="Last Name" 
                          required 
                          value={contactInfo.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email
                      </label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={contactInfo.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Payment Details</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="card-number">
                        Card Number
                      </label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium" htmlFor="expiry">
                          Expiry Date
                        </label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="cvc">
                          CVC
                        </label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Verification</h3>
                    <div className="flex justify-center my-4">
                      <ReCAPTCHA
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key
                        onChange={handleCaptchaChange}
                      />
                    </div>
                    {!captchaValue && (
                      <div className="text-destructive flex items-center text-sm mt-2">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Please complete the CAPTCHA verification
                      </div>
                    )}
                  </div>
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
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Render subscription items */}
                  {groupedItems.subscriptions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Subscriptions</h4>
                      <div className="divide-y">
                        {groupedItems.subscriptions.map(item => (
                          <div key={item.id} className="py-3">
                            <CartItem item={item} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Render event ticket items */}
                  {groupedItems.eventTickets.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Event Tickets</h4>
                      <div className="divide-y">
                        {groupedItems.eventTickets.map(item => (
                          <div key={item.id} className="py-3">
                            <CartItem item={item} />
                            {item.eventId && (
                              <div className="mt-2 text-right">
                                <Link 
                                  to={`/event/${item.eventId}`} 
                                  className="text-xs text-material-primary hover:underline"
                                >
                                  View Event Details
                                </Link>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Render swig circuit ticket items */}
                  {groupedItems.swigCircuitTickets.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Swig Circuit Tickets</h4>
                      <div className="divide-y">
                        {groupedItems.swigCircuitTickets.map(item => (
                          <div key={item.id} className="py-3">
                            <CartItem item={item} />
                            {item.swigCircuitId && (
                              <div className="mt-2 text-right">
                                <Link 
                                  to={`/swig-circuit/${item.swigCircuitId}`} 
                                  className="text-xs text-material-primary hover:underline"
                                >
                                  View Circuit Details
                                </Link>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        Service Fee ({serviceFeePercentage}%):
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-1 inline-flex">
                                <HelpCircle size={14} className="text-gray-400" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>This service fee helps support platform maintenance and payment processing.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 text-lg">
                      <span>Total:</span>
                      <span>${totalWithFees.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
