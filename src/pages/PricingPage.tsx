import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TopNavigation from '@/components/TopNavigation';
import { useCart } from '@/contexts/CartContext';

const PricingFeature = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-2">
    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
    <span className="text-sm text-gray-700">{children}</span>
  </div>
);

const PricingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addItem } = useCart();

  const handleAddToCart = (planName: string, planPrice: number, planType: 'user' | 'establishment', interval: 'monthly' | 'yearly' | 'one-time' = 'monthly') => {
    setIsLoading(true);
    
    // Add to cart with a slight delay to show loading state
    setTimeout(() => {
      addItem({
        id: `${planType}-${planName.toLowerCase()}-${interval}`,
        name: planName,
        price: planPrice,
        type: planType,
        interval: interval
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50">
      <TopNavigation />
      
      <div className="container max-w-6xl mx-auto px-4 py-12 flex-1">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-material-primary hover:underline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your Spiritless journey
          </p>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="users">For Users</TabsTrigger>
            <TabsTrigger value="establishments">For Establishments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <span className="text-xl">Free</span>
                    <span className="text-3xl font-bold mt-2">$0</span>
                    <span className="text-sm text-gray-500">forever</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <PricingFeature>Find nearby non-alcoholic options</PricingFeature>
                    <PricingFeature>View establishment details</PricingFeature>
                    <PricingFeature>Create user profile</PricingFeature>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/signup" className="w-full">
                    <Button variant="outline" className="w-full">Sign Up</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Premium Plan */}
              <Card className="flex flex-col h-full border-material-primary">
                <div className="bg-material-primary text-white py-2 text-center text-sm font-medium">
                  MOST POPULAR
                </div>
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <span className="text-xl">Premium</span>
                    <span className="text-3xl font-bold mt-2">$6.99</span>
                    <span className="text-sm text-gray-500">per month</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <PricingFeature>Everything in Free</PricingFeature>
                    <PricingFeature>Save favorite mocktails</PricingFeature>
                    <PricingFeature>Create and share bar crawls</PricingFeature>
                    <PricingFeature>Ad-free experience</PricingFeature>
                    <PricingFeature>Early access to new features</PricingFeature>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleAddToCart("Premium", 6.99, "user", "monthly")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding to cart..." : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Annual Plan */}
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <span className="text-xl">Annual</span>
                    <span className="text-3xl font-bold mt-2">$59.99</span>
                    <span className="text-sm text-gray-500">per year</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <PricingFeature>Everything in Premium</PricingFeature>
                    <PricingFeature>Save 28% compared to monthly</PricingFeature>
                    <PricingFeature>Priority customer support</PricingFeature>
                    <PricingFeature>Exclusive seasonal guides</PricingFeature>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleAddToCart("Annual", 59.99, "user", "yearly")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding to cart..." : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="establishments" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <span className="text-xl">Basic</span>
                    <span className="text-3xl font-bold mt-2">$29.99</span>
                    <span className="text-sm text-gray-500">per month</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <PricingFeature>List your establishment</PricingFeature>
                    <PricingFeature>Add up to 5 mocktails</PricingFeature>
                    <PricingFeature>Basic analytics</PricingFeature>
                    <PricingFeature>Email support</PricingFeature>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleAddToCart("Basic Establishment", 29.99, "establishment", "monthly")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding to cart..." : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Pro Plan */}
              <Card className="flex flex-col h-full border-material-primary">
                <div className="bg-material-primary text-white py-2 text-center text-sm font-medium">
                  RECOMMENDED
                </div>
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <span className="text-xl">Pro</span>
                    <span className="text-3xl font-bold mt-2">$79.99</span>
                    <span className="text-sm text-gray-500">per month</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <PricingFeature>Everything in Basic</PricingFeature>
                    <PricingFeature>Unlimited mocktails</PricingFeature>
                    <PricingFeature>Featured in search results</PricingFeature>
                    <PricingFeature>Advanced analytics</PricingFeature>
                    <PricingFeature>Priority support</PricingFeature>
                    <PricingFeature>Promotional tools</PricingFeature>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleAddToCart("Pro Establishment", 79.99, "establishment", "monthly")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding to cart..." : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Enterprise Plan */}
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <span className="text-xl">Enterprise</span>
                    <span className="text-3xl font-bold mt-2">$199.99</span>
                    <span className="text-sm text-gray-500">per month</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <PricingFeature>Everything in Pro</PricingFeature>
                    <PricingFeature>Multiple location management</PricingFeature>
                    <PricingFeature>API access</PricingFeature>
                    <PricingFeature>Custom integrations</PricingFeature>
                    <PricingFeature>Dedicated account manager</PricingFeature>
                    <PricingFeature>Premium placement</PricingFeature>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAddToCart("Enterprise", 199.99, "establishment", "monthly")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding to cart..." : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div>
              <h3 className="font-medium mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the current billing cycle.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">We offer a 14-day free trial for all premium plans. No credit card required.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">How do I update my payment information?</h3>
              <p className="text-gray-600">You can update your payment information in your account settings at any time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
