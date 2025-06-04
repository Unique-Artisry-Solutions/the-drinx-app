import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { PricingFeature } from '@/types/PricingTypes';
import { Layout } from '@/components/Layout';

const PricingPage = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    navigate(`/checkout/${planId}`);
  };

  const basicFeatures: PricingFeature[] = [
    { name: "Access to all basic mocktail recipes", included: true },
    { name: "Discover local mocktail venues", included: true },
    { name: "Create a personal profile", included: true },
    { name: "Save favorite drinks", included: true },
    { name: "Limited bar crawl participation", included: true },
    { name: "Community forum access", included: false },
    { name: "Exclusive events access", included: false },
    { name: "Premium recipe collections", included: false },
    { name: "Ad-free experience", included: false },
  ];

  const proFeatures: PricingFeature[] = [
    { name: "All Basic features", included: true },
    { name: "Unlimited bar crawl creation", included: true },
    { name: "Ad-free experience", included: true },
    { name: "Premium recipe collections", included: true },
    { name: "Community forum access", included: true },
    { name: "Exclusive events access", included: true },
    { name: "Early access to new features", included: true },
    { name: "Priority customer support", included: false },
    { name: "Personalized recommendations", included: false },
  ];

  const premiumFeatures: PricingFeature[] = [
    { name: "All Pro features", included: true },
    { name: "Priority customer support", included: true },
    { name: "Personalized recommendations", included: true },
    { name: "VIP event invitations", included: true },
    { name: "Exclusive merchandise discounts", included: true },
    { name: "Custom mocktail consultations", included: true },
    { name: "Partner establishment discounts", included: true },
    { name: "Seasonal gift boxes", included: true },
    { name: "Dedicated account manager", included: true },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan to enhance your alcohol-free experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <Card className="flex flex-col border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Basic</CardTitle>
                <Star className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">Free</span>
                <span className="text-muted-foreground ml-1">forever</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Perfect for casual mocktail enthusiasts
              </p>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <Button 
                onClick={() => handleSelectPlan('basic')}
                variant="outline"
                className="mb-6 w-full"
              >
                Get Started
              </Button>
              
              <Separator className="mb-6" />
              
              <div className="space-y-3 flex-grow">
                {basicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`rounded-full p-1 mr-2 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                      <Check className="h-4 w-4" />
                    </div>
                    <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="flex flex-col relative border-primary/50 shadow-md">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                MOST POPULAR
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Pro</CardTitle>
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                For dedicated mocktail lovers and social drinkers
              </p>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <Button 
                onClick={() => handleSelectPlan('pro')}
                className="mb-6 w-full"
              >
                Subscribe Now
              </Button>
              
              <Separator className="mb-6" />
              
              <div className="space-y-3 flex-grow">
                {proFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`rounded-full p-1 mr-2 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                      <Check className="h-4 w-4" />
                    </div>
                    <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="flex flex-col border-gray-200 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Premium</CardTitle>
                <Crown className="h-5 w-5 text-amber-500" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                The ultimate mocktail connoisseur experience
              </p>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <Button 
                onClick={() => handleSelectPlan('premium')}
                variant="outline"
                className="mb-6 w-full border-amber-500 text-amber-700 hover:bg-amber-50"
              >
                Go Premium
              </Button>
              
              <Separator className="mb-6" />
              
              <div className="space-y-3 flex-grow">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-amber-500 rounded-full p-1 mr-2">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our pricing plans? Check out our FAQ section or contact our support team.
          </p>
          <Button variant="link" className="mt-4">
            View FAQ
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
