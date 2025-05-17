import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingTierCardProps {
  name: string;
  tier: 'free' | 'basic' | 'premium' | 'vip';
  price: number;
  description: string;
  isPopular?: boolean;
  onSubscribe: () => void;
  userType: 'individual' | 'establishment' | 'promoter';
  billingPeriod: 'monthly' | 'yearly';
  isCurrentPlan?: boolean;
}

const PricingTierCard: React.FC<PricingTierCardProps> = ({
  name,
  tier,
  price,
  description,
  isPopular = false,
  onSubscribe,
  userType,
  billingPeriod,
  isCurrentPlan = false
}) => {
  // Features by tier and user type
  const featuresByTierAndType: Record<string, Record<string, string[]>> = {
    individual: {
      free: [
        "Access to mocktail recipes",
        "Find non-alcoholic venues",
        "Create a personal profile"
      ],
      basic: [
        "All Free features",
        "Participate in bar crawls",
        "Save favorite establishments",
        "Access to special promotions"
      ],
      premium: [
        "All Basic features",
        "Create custom mocktail lists",
        "Priority bar crawl registration",
        "Exclusive event invitations",
        "Early access to new features"
      ],
      vip: [
        "All Premium features",
        "Personal mocktail concierge",
        "VIP event access",
        "Dedicated support channel",
        "Influence app development"
      ]
    },
    establishment: {
      free: [
        "Basic venue listing",
        "Showcase mocktail menu",
        "Connect with local users"
      ],
      basic: [
        "All Free features",
        "Enhanced venue profile",
        "Analytics dashboard",
        "Targeted promotions"
      ],
      premium: [
        "All Basic features",
        "Priority listing in search",
        "Custom branding options",
        "Dedicated account manager",
        "Exclusive partnership opportunities"
      ],
      vip: [
        "All Premium features",
        "Full marketing suite",
        "Advanced analytics",
        "VIP support",
        "Influence app development"
      ]
    },
    promoter: {
      free: [
        "Basic event promotion",
        "Connect with local venues",
        "Track event attendance"
      ],
      basic: [
        "All Free features",
        "Advanced event promotion",
        "Targeted marketing tools",
        "Analytics dashboard"
      ],
      premium: [
        "All Basic features",
        "Priority event listing",
        "Custom branding options",
        "Dedicated account manager",
        "Exclusive partnership opportunities"
      ],
      vip: [
        "All Premium features",
        "Full marketing suite",
        "Advanced analytics",
        "VIP support",
        "Influence app development"
      ]
    }
  };

  // Get the appropriate feature set
  const features = featuresByTierAndType[userType]?.[tier] || [];
  
  return (
    <Card className={cn(
      "flex flex-col",
      isPopular && "border-purple-400 shadow-lg",
      isCurrentPlan && "border-green-400 shadow-md"
    )}>
      {isPopular && (
        <div className="bg-purple-600 text-white text-center py-1.5 text-sm font-medium">
          Most Popular
        </div>
      )}
      {isCurrentPlan && (
        <div className="bg-green-600 text-white text-center py-1.5 text-sm font-medium">
          Current Plan
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 flex-1">
        <div>
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
          {price > 0 && <span className="text-muted-foreground ml-1">{billingPeriod === 'monthly' ? '/month' : '/year'}</span>}
        </div>
        <ul className="grid gap-2 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSubscribe} 
          className={cn(
            "w-full", 
            isPopular ? "bg-purple-600 hover:bg-purple-700" : "",
            isCurrentPlan ? "bg-green-600 hover:bg-green-700" : ""
          )}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Current Plan" : tier === "free" ? "Get Started" : "Subscribe Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingTierCard;
