
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Users, Building2, Share2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useNavigation } from '@/contexts/NavigationContext';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended: boolean;
  buttonText: string;
  buttonVariant: "outline" | "default" | "gradient";
  userType: "individual" | "establishment" | "promoter";
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  description,
  features,
  recommended,
  buttonText,
  buttonVariant,
  userType
}) => {
  const { goToRoute } = useAppNavigation();
  
  const handleSubscribe = () => {
    // Redirect to signup with plan info in query parameters
    goToRoute(`/signup?plan=${name.toLowerCase()}&userType=${userType}`, {
      showToast: true,
      toastMessage: `You selected the ${name} plan. Complete your registration to get started.`,
      toastType: 'info'
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className={cn(
        "flex flex-col h-full overflow-hidden",
        recommended ? "border-primary shadow-lg shadow-primary/20" : "border-border"
      )}>
        {recommended && (
          <div className="bg-primary py-1 px-4 text-primary-foreground text-center text-sm font-medium">
            Recommended
          </div>
        )}
        
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-bold tracking-tight">{price}</span>
            <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
          </div>
          <CardDescription className="mt-2">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <ul className="space-y-2 text-sm">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="pt-4 pb-6">
          <Button 
            className="w-full" 
            variant={buttonVariant} 
            onClick={handleSubscribe}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const PricingPage = () => {
  const { goToHomePage } = useAppNavigation();
  const { userType } = useNavigation();
  const [activeTab, setActiveTab] = useState<string>(userType === "establishment" ? "establishment" : userType === "promoter" ? "promoter" : "individual");
  
  const individualPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic features for casual users",
      features: [
        "Discover spiritless cocktails",
        "Save favorite recipes",
        "Join public Swig Circuits",
        "Basic profile features",
        "Access to community content"
      ],
      recommended: false,
      buttonText: "Sign Up Free",
      buttonVariant: "outline" as const,
      key: "free",
      userType: "individual" as const
    },
    {
      name: "Premium",
      price: "$9.99",
      description: "Enhanced features for enthusiasts",
      features: [
        "Everything in Free plan",
        "Ad-free experience",
        "Exclusive recipes and content",
        "Priority access to Swig Circuits",
        "Discounts at partner establishments",
        "Create custom recipe collections"
      ],
      recommended: true,
      buttonText: "Get Premium",
      buttonVariant: "gradient" as const,
      key: "premium",
      userType: "individual" as const
    },
    {
      name: "Family",
      price: "$14.99",
      description: "Share the experience with your family",
      features: [
        "Everything in Premium",
        "Up to 5 family member accounts",
        "Shared recipe collections",
        "Group discounts on events",
        "Family achievement tracking",
        "Priority customer support"
      ],
      recommended: false,
      buttonText: "Choose Family Plan",
      buttonVariant: "default" as const,
      key: "family",
      userType: "individual" as const
    }
  ];

  const establishmentPlans = [
    {
      name: "Basic",
      price: "$29.99",
      description: "Essential tools for small establishments",
      features: [
        "Establishment profile",
        "Basic menu management",
        "Customer reviews & insights",
        "Accept check-ins",
        "Participate in Swig Circuits",
        "Basic analytics dashboard"
      ],
      recommended: false,
      buttonText: "Start Basic",
      buttonVariant: "outline" as const,
      key: "establishment-basic",
      userType: "establishment" as const
    },
    {
      name: "Professional",
      price: "$59.99",
      description: "Full suite for growing businesses",
      features: [
        "Everything in Basic",
        "Custom branding options",
        "Promotion tools & deals",
        "Advanced analytics",
        "Email marketing integration",
        "Dedicated account manager",
        "Customer loyalty tools"
      ],
      recommended: true,
      buttonText: "Go Professional",
      buttonVariant: "gradient" as const,
      key: "establishment-pro",
      userType: "establishment" as const
    },
    {
      name: "Enterprise",
      price: "$119.99",
      description: "Complete platform for large venues & chains",
      features: [
        "Everything in Professional",
        "Multi-location management",
        "Custom API integration",
        "VIP customer identification",
        "Advanced promotion tools",
        "White-label mobile experience",
        "Dedicated support team"
      ],
      recommended: false,
      buttonText: "Contact Sales",
      buttonVariant: "default" as const,
      key: "establishment-enterprise",
      userType: "establishment" as const
    }
  ];

  const promoterPlans = [
    {
      name: "Basic",
      price: "$39.99",
      description: "Essential tools for event promoters",
      features: [
        "Event creation & management",
        "Basic ticket types",
        "Event check-in tools",
        "Basic promotional tools",
        "Simple attendee management",
        "Standard analytics"
      ],
      recommended: false,
      buttonText: "Start Promoting",
      buttonVariant: "outline" as const,
      key: "promoter-basic",
      userType: "promoter" as const
    },
    {
      name: "Professional",
      price: "$79.99",
      description: "Advanced tools for serious promoters",
      features: [
        "Everything in Basic",
        "Multiple ticket tiers",
        "Promotional code generation",
        "Advanced marketing tools",
        "Venue communication system",
        "Comprehensive analytics",
        "Email marketing integration"
      ],
      recommended: true,
      buttonText: "Go Professional",
      buttonVariant: "gradient" as const,
      key: "promoter-pro",
      userType: "promoter" as const
    },
    {
      name: "Enterprise",
      price: "$149.99",
      description: "Complete platform for large-scale promoters",
      features: [
        "Everything in Professional",
        "Unlimited events",
        "VIP package creation",
        "Advanced attendee segmentation",
        "Custom branding options",
        "API integration & webhooks",
        "Dedicated account manager",
        "Priority support"
      ],
      recommended: false,
      buttonText: "Contact Sales",
      buttonVariant: "default" as const,
      key: "promoter-enterprise",
      userType: "promoter" as const
    }
  ];

  return (
    <div className="container py-10 max-w-7xl">
      <div className="flex items-center mb-8 space-x-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => goToHomePage(userType)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
      </div>

      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">For Users</span>
            </TabsTrigger>
            <TabsTrigger value="establishment" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">For Establishments</span>
            </TabsTrigger>
            <TabsTrigger value="promoter" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">For Promoters</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="individual">
          <div className="grid md:grid-cols-3 gap-6">
            {individualPlans.map((plan) => (
              <PricingCard key={plan.key} {...plan} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="establishment">
          <div className="grid md:grid-cols-3 gap-6">
            {establishmentPlans.map((plan) => (
              <PricingCard key={plan.key} {...plan} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="promoter">
          <div className="grid md:grid-cols-3 gap-6">
            {promoterPlans.map((plan) => (
              <PricingCard key={plan.key} {...plan} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the beginning of your next billing cycle.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do I cancel my subscription?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You can cancel your subscription anytime from your account settings. You'll continue to have access until the end of your current billing period.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team within 14 days of your purchase.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Are there any long-term contracts?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No, all our plans are month-to-month with no long-term commitment. Annual plans are available at a discount but are optional.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We accept all major credit cards, PayPal, and select cryptocurrencies. Enterprise customers can also pay via invoice.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is my data secure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes, we use industry-standard encryption and security practices to protect your data. Read our Privacy Policy for more details.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
