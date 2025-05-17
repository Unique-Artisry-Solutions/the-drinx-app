
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Steps } from '@/components/ui/steps';
import CheckoutContactForm from '@/components/checkout/CheckoutContactForm';
import { CheckoutPaymentForm } from '@/components/checkout/CheckoutPaymentForm';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import { EmptyCartView } from '@/components/checkout/EmptyCartView';
import { CheckoutVerification } from '@/components/checkout/CheckoutVerification';
import { DiscountCodeSection, AppliedDiscount } from '@/components/checkout/DiscountCodeSection';
import { DiscountSavingsIndicator } from '@/components/checkout/DiscountSavingsIndicator';
import { SavedPromotionCodes } from '@/components/checkout/SavedPromotionCodes';

const CheckoutPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  
  // Mock cart data
  const cart = {
    items: [
      { id: 1, name: 'Item 1', price: 20, quantity: 2 },
      { id: 2, name: 'Item 2', price: 15, quantity: 1 }
    ]
  };
  
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Mock user data
  const user = {
    id: 'user123',
    email: 'user@example.com'
  };
  
  // Check if cart is empty
  const isCartEmpty = cart.items.length === 0;
  
  const handleApplyDiscount = (discount: AppliedDiscount) => {
    setAppliedDiscount(discount);
  };
  
  const calculateTotal = () => {
    if (!appliedDiscount) return subtotal;
    
    if (appliedDiscount.type === 'percentage') {
      return subtotal - (subtotal * appliedDiscount.value / 100);
    }
    
    return subtotal - appliedDiscount.value;
  };
  
  if (isCartEmpty) {
    return (
      <Layout>
        <EmptyCartView />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="mb-8">
          <Steps 
            steps={['Contact Information', 'Payment', 'Verification']} 
            currentStep={currentStep}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Contact Information'}
                  {currentStep === 2 && 'Payment Details'}
                  {currentStep === 3 && 'Verify Order'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 1 && (
                  <CheckoutContactForm 
                    onNext={() => setCurrentStep(2)}
                    defaultValues={user}
                  />
                )}
                
                {currentStep === 2 && (
                  <CheckoutPaymentForm
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                  />
                )}
                
                {currentStep === 3 && (
                  <CheckoutVerification
                    onBack={() => setCurrentStep(2)}
                    onComplete={() => {
                      // Handle order completion
                      console.log('Order completed');
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutSummary 
                  items={cart.items}
                  subtotal={subtotal}
                  discount={appliedDiscount}
                  total={calculateTotal()}
                />
                
                <DiscountCodeSection 
                  onApplyDiscount={handleApplyDiscount}
                  currentDiscount={appliedDiscount}
                />
                
                {appliedDiscount && appliedDiscount.code && (
                  <DiscountSavingsIndicator
                    subtotal={subtotal}
                    discount={appliedDiscount.value}
                    discountCode={appliedDiscount.code}
                    discountType={appliedDiscount.type}
                  />
                )}
                
                {user && user.id && currentStep === 2 && (
                  <SavedPromotionCodes 
                    userId={user.id} 
                    onApplyCode={handleApplyDiscount}
                  />
                )}
                
                {user && user.id && currentStep === 3 && (
                  <SavedPromotionCodes 
                    userId={user.id} 
                    onApplyCode={handleApplyDiscount}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
