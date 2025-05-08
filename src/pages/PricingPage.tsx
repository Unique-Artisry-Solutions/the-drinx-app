
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import PricingTierCard from '@/components/pricing/PricingTierCard';
import FeatureTierComparison from '@/components/pricing/FeatureTierComparison';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import BackButton from '@/components/navigation/BackButton';

const PricingPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  
  // Get user type from localStorage if available
  React.useEffect(() => {
    const storedUserType = localStorage.getItem('user_type');
    if (storedUserType === 'establishment') {
      setUserType('establishment');
    } else if (storedUserType === 'promoter') {
      setUserType('promoter');
    } else {
      setUserType('individual');
    }
  }, []);
  
  // Define pricing tiers for each user type
  const pricingTiersByType = {
    individual: [
      {
        name: 'Free',
        tier: 'free',
        price: 0,
        description: 'Basic features for casual users',
        isPopular: false,
      },
      {
        name: 'Basic',
        tier: 'basic',
        price: billingPeriod === 'monthly' ? 9.99 : 99.99,
        description: 'Enhanced experience for regulars',
        isPopular: false,
      },
      {
        name: 'Premium',
        tier: 'premium',
        price: billingPeriod === 'monthly' ? 19.99 : 199.99,
        description: 'Complete access for enthusiasts',
        isPopular: true,
      },
      {
        name: 'VIP',
        tier: 'vip',
        price: billingPeriod === 'monthly' ? 49.99 : 499.99,
        description: 'Ultimate experience with priority access',
        isPopular: false,
      }
    ],
    establishment: [
      {
        name: 'Free',
        tier: 'free',
        price: 0,
        description: 'Basic listing for your venue',
        isPopular: false,
      },
      {
        name: 'Basic',
        tier: 'basic',
        price: billingPeriod === 'monthly' ? 29.99 : 299.99,
        description: 'Enhanced visibility and analytics',
        isPopular: false,
      },
      {
        name: 'Premium',
        tier: 'premium',
        price: billingPeriod === 'monthly' ? 79.99 : 799.99,
        description: 'Full marketing tools and insights',
        isPopular: true,
      },
      {
        name: 'VIP',
        tier: 'vip',
        price: billingPeriod === 'monthly' ? 149.99 : 1499.99,
        description: 'Enterprise features for large venues',
        isPopular: false,
      }
    ],
    promoter: [
      {
        name: 'Free',
        tier: 'free',
        price: 0,
        description: 'Basic tools for event promotion',
        isPopular: false,
      },
      {
        name: 'Basic',
        tier: 'basic',
        price: billingPeriod === 'monthly' ? 49.99 : 499.99,
        description: 'Advanced promotion capabilities',
        isPopular: false,
      },
      {
        name: 'Premium',
        tier: 'premium',
        price: billingPeriod === 'monthly' ? 99.99 : 999.99,
        description: 'Complete marketing suite',
        isPopular: true,
      },
      {
        name: 'VIP',
        tier: 'vip',
        price: billingPeriod === 'monthly' ? 199.99 : 1999.99,
        description: 'Enterprise-level promotion platform',
        isPopular: false,
      }
    ]
  };
  
  // Get current tiers based on selected user type
  const currentPricingTiers = pricingTiersByType[userType];

  const handleSubscribe = (tier: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or create an account to subscribe.",
        variant: "default",
      });
      navigate('/login', { state: { redirectTo: '/pricing' } });
      return;
    }
    
    // Handle subscription logic here
    toast({
      title: "Subscription Request",
      description: `You've selected the ${tier} plan for ${userType} account. This feature is coming soon!`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="container py-12 px-4 md:px-6">
        <div className="mb-8">
          <BackButton fallbackPath="/" label="Back to Home" variant="outline" />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Select your user type to see relevant pricing options.
          </p>
          
          {/* User type selection */}
          <div className="mt-6 inline-block">
            <Tabs 
              defaultValue={userType} 
              value={userType}
              onValueChange={(value) => setUserType(value as 'individual' | 'establishment' | 'promoter')}
              className="w-[400px]"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="individual">Individual</TabsTrigger>
                <TabsTrigger value="establishment">Establishment</TabsTrigger>
                <TabsTrigger value="promoter">Promoter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Billing period toggle */}
          <div className="mt-6 inline-block">
            <Tabs 
              defaultValue="monthly" 
              value={billingPeriod}
              onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
              className="w-[300px]"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly <span className="ml-1 text-xs text-green-500 font-medium">Save 20%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative mt-8">
          {currentPricingTiers.map((tier) => (
            <PricingTierCard
              key={tier.tier}
              name={tier.name}
              tier={tier.tier as 'free' | 'basic' | 'premium' | 'vip'}
              price={tier.price}
              description={tier.description}
              isPopular={tier.isPopular}
              onSubscribe={() => handleSubscribe(tier.tier)}
              userType={userType}
              billingPeriod={billingPeriod}
            />
          ))}
        </div>

        {/* Feature comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Compare Features</h2>
          <FeatureTierComparison 
            highlightTier="premium" 
            className="max-w-5xl mx-auto"
            userType={userType}
          />
        </div>

        {/* FAQ or additional info */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Questions? We're here to help.</h2>
          <p className="text-muted-foreground mb-8">
            Our support team is just a click away to help you choose the right plan for your {userType} account.
          </p>
          <Button 
            onClick={() => navigate('/contact')}
            variant="outline"
            className="min-w-[150px]"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
