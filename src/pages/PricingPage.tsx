
import React, { useState } from 'react';
import { ArrowLeft, Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import LinkComponent from '@/components/navigation/LinkComponent';
import { useAppNavigation } from '@/hooks/useAppNavigation';

// FAQ data
const faqItems = [
  {
    question: "What happens after my trial ends?",
    answer: "After your trial period ends, your account will automatically transition to our free tier. You can upgrade to any paid plan at any time to unlock additional features."
  },
  {
    question: "Can I switch between plans?",
    answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes to your subscription will take effect at the start of your next billing cycle."
  },
  {
    question: "Are there any setup fees?",
    answer: "No, there are no setup fees for any of our plans. You only pay the advertised subscription price."
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes, we offer a 15% discount when you choose annual billing instead of monthly billing."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
  },
  {
    question: "How do promoter plans differ from establishment plans?",
    answer: "Promoter plans focus on event management, ticket sales, and promotional tools while establishment plans focus on venue management, menu customization, and customer engagement."
  },
  {
    question: "Can I use promotional tools with my establishment account?",
    answer: "Basic promotional tools are included with establishment accounts, but for advanced promotional features, we recommend upgrading to a promoter account."
  }
];

// Individual plans data
const individualPlans = [
  {
    name: "Free",
    price: "0",
    description: "Basic features for casual users",
    features: [
      "Access to cocktail database",
      "Map view of local establishments",
      "Save favorite venues",
      "Personal profile",
      "Join bar crawls"
    ],
    recommended: false,
    buttonText: "Get Started",
    buttonVariant: "outline"
  },
  {
    name: "Premium",
    price: "9.99",
    description: "Enhanced features for enthusiasts",
    features: [
      "Everything in Free",
      "No advertisements",
      "Early access to events",
      "Exclusive rewards",
      "Priority support",
      "Custom bar crawl creation"
    ],
    recommended: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default"
  },
  {
    name: "Family",
    price: "19.99",
    description: "Share the experience with your family",
    features: [
      "Everything in Premium",
      "Up to 5 family accounts",
      "Family event planning",
      "Shared collections",
      "Discounted event tickets",
      "Premium support"
    ],
    recommended: false,
    buttonText: "Start Free Trial",
    buttonVariant: "outline"
  }
];

// Establishment plans data
const establishmentPlans = [
  {
    name: "Basic",
    price: "29.99",
    description: "Essential tools for small venues",
    features: [
      "Full venue profile",
      "Menu management",
      "Basic analytics",
      "Customer reviews",
      "Event listings",
      "Standard support"
    ],
    recommended: false,
    buttonText: "Start Free Trial",
    buttonVariant: "outline"
  },
  {
    name: "Professional",
    price: "79.99",
    description: "Advanced tools for growing businesses",
    features: [
      "Everything in Basic",
      "Premium placement on map",
      "Advanced analytics",
      "Promotional tools",
      "Menu design features",
      "Priority support",
      "Reservation management"
    ],
    recommended: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default"
  },
  {
    name: "Enterprise",
    price: "149.99",
    description: "Complete solution for large venues & chains",
    features: [
      "Everything in Professional",
      "Multiple location management",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "Staff management tools",
      "Inventory tracking",
      "Private events features"
    ],
    recommended: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline"
  }
];

// New promoter plans data
const promoterPlans = [
  {
    name: "Basic",
    price: "39.99",
    description: "Essential tools for event promoters",
    features: [
      "Event creation and management",
      "Basic ticketing system",
      "Promotional code generation",
      "Event listings on platform",
      "Basic analytics",
      "Standard support"
    ],
    recommended: false,
    buttonText: "Start Free Trial",
    buttonVariant: "outline"
  },
  {
    name: "Professional",
    price: "79.99",
    description: "Advanced tools for experienced promoters",
    features: [
      "Everything in Basic",
      "Advanced ticketing options",
      "Multiple ticket tiers",
      "Attendee management",
      "Event notification scheduling",
      "Marketing tools",
      "Priority support",
      "Custom event pages"
    ],
    recommended: true,
    buttonText: "Start Free Trial",
    buttonVariant: "gradient"
  },
  {
    name: "Enterprise",
    price: "149.99",
    description: "Complete solution for professional event companies",
    features: [
      "Everything in Professional",
      "Multi-event management",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "Staff management tools",
      "Advanced analytics dashboard",
      "Custom attendee fields",
      "White-label ticketing"
    ],
    recommended: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline"
  }
];

const PricingCard = ({
  name,
  price,
  description,
  features,
  recommended,
  buttonText,
  buttonVariant,
  userType
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "gradient";
  userType: "individual" | "establishment" | "promoter";
}) => {
  const { goToRoute } = useAppNavigation();
  
  // Determine colors based on user type
  const getBadgeColor = () => {
    switch (userType) {
      case "promoter":
        return "bg-purple-600 text-white";
      case "establishment":
        return "bg-green-600 text-white";
      default:
        return "bg-spiritless-pink text-white";
    }
  };
  
  const getButtonStyles = () => {
    if (buttonVariant === "gradient" && userType === "promoter") {
      return "bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800";
    }
    return "";
  };

  const handleGetStarted = () => {
    // Direct to sign up page with plan info
    goToRoute('/signup', { 
      state: { plan: name, userType },
      showToast: true,
      toastMessage: `Selected the ${name} plan for ${userType} account`,
      toastType: "info"
    });
  };

  return (
    <Card className={`flex flex-col h-full ${recommended ? 'border-2 shadow-lg' : 'border'} ${
      userType === "promoter" && recommended ? 'border-purple-500' : 
      userType === "establishment" && recommended ? 'border-green-500' : 
      recommended ? 'border-spiritless-pink' : ''
    }`}>
      <CardHeader className="pb-1">
        {recommended && (
          <div className={`${getBadgeColor()} text-xs font-medium py-1 px-2 rounded-full w-fit mx-auto mb-2 flex items-center gap-1`}>
            <Crown className="h-3 w-3" /> Recommended
          </div>
        )}
        <CardTitle className="text-xl font-bold text-center">{name}</CardTitle>
        <div className="text-center mt-2">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-2">{description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2 text-sm">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className={`h-4 w-4 mr-2 mt-1 ${
                userType === "promoter" ? "text-purple-500" : 
                userType === "establishment" ? "text-green-600" : 
                "text-spiritless-pink"
              }`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          onClick={handleGetStarted} 
          variant={buttonVariant === "gradient" ? "default" : buttonVariant} 
          className={`w-full ${getButtonStyles()}`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PricingPage: React.FC = () => {
  const { goToHomePage } = useAppNavigation();
  const [activeTab, setActiveTab] = useState<string>("individual");
  
  // Determine tab styles based on active tab
  const getTabStyles = (tabValue: string) => {
    if (tabValue === activeTab) {
      if (tabValue === "promoter") {
        return "bg-purple-600 text-white";
      } else if (tabValue === "establishment") {
        return "bg-green-600 text-white";
      } else {
        return "bg-spiritless-pink text-white";
      }
    }
    return "";
  };

  return (
    <Layout>
      <div className="container py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => goToHomePage()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the right plan for your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <Tabs 
          defaultValue="individual" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-12"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger 
              value="individual"
              className={`text-base py-3 ${getTabStyles('individual')}`}
            >
              For Users
            </TabsTrigger>
            <TabsTrigger 
              value="establishment"
              className={`text-base py-3 ${getTabStyles('establishment')}`}
            >
              For Establishments
            </TabsTrigger>
            <TabsTrigger 
              value="promoter"
              className={`text-base py-3 ${getTabStyles('promoter')}`}
            >
              For Promoters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              {individualPlans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  {...plan}
                  userType="individual"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="establishment" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              {establishmentPlans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  {...plan}
                  userType="establishment"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="promoter" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              {promoterPlans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  {...plan}
                  userType="promoter"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Contact our team for more information about our pricing plans.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg">
              Contact Sales
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PricingPage;
