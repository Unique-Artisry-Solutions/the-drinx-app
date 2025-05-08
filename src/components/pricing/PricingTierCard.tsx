
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { FeatureId, featuresByTier, getFeature } from '@/lib/features/registry';
import FeatureBadge from './FeatureBadge';
import { cn } from '@/lib/utils';

interface PricingTierProps {
  name: string;
  tier: 'free' | 'basic' | 'premium' | 'vip';
  price: number;
  description: string;
  isPopular?: boolean;
  className?: string;
  onSubscribe?: () => void;
  userType?: 'individual' | 'establishment' | 'promoter';
}

const PricingTierCard: React.FC<PricingTierProps> = ({
  name,
  tier,
  price,
  description,
  isPopular = false,
  className,
  onSubscribe,
  userType = 'individual',
}) => {
  // Get the features for this tier
  const tierFeatures = featuresByTier[tier] || [];

  // Get the top features to display (limit to 6)
  const displayFeatures = tierFeatures
    .slice(0, 6)
    .map(featureId => getFeature(featureId))
    .filter(Boolean);
  
  // Determine if this tier is recommended for the current user type
  const isRecommendedForUserType = 
    (userType === 'individual' && ['basic', 'premium'].includes(tier)) ||
    (userType === 'establishment' && ['premium', 'vip'].includes(tier)) ||
    (userType === 'promoter' && tier === 'vip');
  
  // Determine if this tier is suitable for the current user type
  const isSuitableForUserType = 
    (userType === 'individual') ||
    (userType === 'establishment' && tier !== 'free') ||
    (userType === 'promoter' && ['premium', 'vip'].includes(tier));
  
  const cardClass = cn(
    "flex flex-col justify-between",
    isPopular ? "border-primary shadow-lg" : "",
    !isSuitableForUserType ? "opacity-70" : "",
    className
  );
  
  const badgeLabel = isRecommendedForUserType 
    ? `Recommended for ${userType}s` 
    : tier.charAt(0).toUpperCase() + tier.slice(1);
  
  const getPricingFeaturesByUserType = () => {
    // User type specific features to highlight
    if (userType === 'individual') {
      return [
        'Personal profile access',
        'Bar crawl participation',
        'Mocktail recipe access',
        'Check-in rewards',
        'Order history tracking',
        tier === 'premium' || tier === 'vip' ? 'Priority event access' : null,
        tier === 'vip' ? 'VIP event invitations' : null,
      ].filter(Boolean);
    } else if (userType === 'establishment') {
      return [
        'Business profile listing',
        'Menu management',
        tier === 'basic' || tier === 'premium' || tier === 'vip' ? 'Analytics dashboard' : null,
        tier === 'basic' || tier === 'premium' || tier === 'vip' ? 'Customer insights' : null,
        tier === 'premium' || tier === 'vip' ? 'Promotion tools' : null,
        tier === 'premium' || tier === 'vip' ? 'Featured placement' : null,
        tier === 'vip' ? 'Dedicated account manager' : null,
      ].filter(Boolean);
    } else {
      // Promoter
      return [
        'Event listing',
        tier === 'basic' || tier === 'premium' || tier === 'vip' ? 'Attendee management' : null,
        tier === 'basic' || tier === 'premium' || tier === 'vip' ? 'Promotional tools' : null,
        tier === 'premium' || tier === 'vip' ? 'Marketing analytics' : null,
        tier === 'premium' || tier === 'vip' ? 'Ticket sales integration' : null,
        tier === 'vip' ? 'Custom branding options' : null,
        tier === 'vip' ? 'Priority support' : null,
      ].filter(Boolean);
    }
  };
  
  const userTypeFeatures = getPricingFeaturesByUserType();
  
  return (
    <Card className={cardClass}>
      {isPopular && (
        <div className="absolute inset-x-0 -top-5 mx-auto w-fit px-4 py-1 rounded-full bg-primary text-white text-xs font-medium">
          Most Popular
        </div>
      )}
      
      {isRecommendedForUserType && !isPopular && (
        <div className="absolute inset-x-0 -top-5 mx-auto w-fit px-4 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
          Recommended
        </div>
      )}
      
      <CardHeader className={cn(isPopular || isRecommendedForUserType ? "pt-8" : "")}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{name}</CardTitle>
            <CardDescription className="mt-1.5">{description}</CardDescription>
          </div>
          <FeatureBadge tier={tier} label={badgeLabel} />
        </div>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-medium mb-4">Included features:</p>
        <ul className="space-y-2.5">
          {userTypeFeatures.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
          {userTypeFeatures.length > 6 && (
            <li className="text-muted-foreground text-sm ml-7">
              +{userTypeFeatures.length - 6} more features
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <Button
          onClick={onSubscribe}
          className="w-full"
          variant={isPopular || isRecommendedForUserType ? "default" : "outline"}
          disabled={!isSuitableForUserType}
        >
          {tier === 'free' ? 'Get Started' : 'Subscribe Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingTierCard;
