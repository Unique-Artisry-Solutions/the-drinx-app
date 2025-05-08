
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import { featuresByTier, featureRegistry, getFeaturesForCategory } from '@/lib/features/registry';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Props for the FeatureTierComparison component
 */
interface FeatureTierComparisonProps {
  showAllFeatures?: boolean;
  highlightTier?: string;
  className?: string;
  userType?: 'individual' | 'establishment' | 'promoter';
}

/**
 * A component that displays a side-by-side comparison of features across different subscription tiers
 */
const FeatureTierComparison: React.FC<FeatureTierComparisonProps> = ({
  showAllFeatures = false,
  highlightTier,
  className,
  userType = 'individual',
}) => {
  // Get all features, grouped by category
  const categories = Object.keys(featureRegistry).reduce((acc, featureId) => {
    const feature = featureRegistry[featureId as keyof typeof featureRegistry];
    if (!feature.category) return acc;
    
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, any[]>);

  // Get all tiers for display
  const tiers = ['free', 'basic', 'premium', 'vip'];
  
  // Define user type specific features for comparison
  const getUserSpecificFeatures = () => {
    if (userType === 'individual') {
      return {
        'Core Features': [
          { id: 'profile', name: 'Personal Profile', free: true, basic: true, premium: true, vip: true },
          { id: 'search', name: 'Search & Discovery', free: true, basic: true, premium: true, vip: true },
          { id: 'favs', name: 'Favorites List', free: true, basic: true, premium: true, vip: true },
          { id: 'recipes', name: 'Recipe Access', free: true, basic: true, premium: true, vip: true },
        ],
        'Social Features': [
          { id: 'checkin', name: 'Check-ins', free: true, basic: true, premium: true, vip: true },
          { id: 'reviews', name: 'Leave Reviews', free: false, basic: true, premium: true, vip: true },
          { id: 'crawl-join', name: 'Join Bar Crawls', free: true, basic: true, premium: true, vip: true },
          { id: 'crawl-create', name: 'Create Bar Crawls', free: false, basic: true, premium: true, vip: true },
        ],
        'Premium Features': [
          { id: 'notifications', name: 'Personalized Alerts', free: false, basic: true, premium: true, vip: true },
          { id: 'ad-free', name: 'Ad-Free Experience', free: false, basic: false, premium: true, vip: true },
          { id: 'priority-access', name: 'Priority Event Access', free: false, basic: false, premium: true, vip: true },
          { id: 'vip-events', name: 'VIP Event Invitations', free: false, basic: false, premium: false, vip: true },
        ]
      };
    } else if (userType === 'establishment') {
      return {
        'Core Features': [
          { id: 'profile', name: 'Business Profile', free: true, basic: true, premium: true, vip: true },
          { id: 'menu', name: 'Menu Management', free: true, basic: true, premium: true, vip: true },
          { id: 'hours', name: 'Business Hours', free: true, basic: true, premium: true, vip: true },
          { id: 'photos', name: 'Photo Gallery', free: true, basic: true, premium: true, vip: true },
        ],
        'Marketing Features': [
          { id: 'analytics', name: 'Analytics Dashboard', free: false, basic: true, premium: true, vip: true },
          { id: 'customer-insights', name: 'Customer Insights', free: false, basic: true, premium: true, vip: true },
          { id: 'promo-tools', name: 'Promotion Tools', free: false, basic: false, premium: true, vip: true },
          { id: 'featured', name: 'Featured Placement', free: false, basic: false, premium: true, vip: true },
        ],
        'Premium Features': [
          { id: 'premium-support', name: 'Priority Support', free: false, basic: false, premium: true, vip: true },
          { id: 'export-data', name: 'Data Export', free: false, basic: false, premium: true, vip: true },
          { id: 'advanced-reports', name: 'Advanced Reports', free: false, basic: false, premium: false, vip: true },
          { id: 'account-manager', name: 'Dedicated Account Manager', free: false, basic: false, premium: false, vip: true },
        ]
      };
    } else {
      // Promoter features
      return {
        'Core Features': [
          { id: 'event-listing', name: 'Event Listing', free: true, basic: true, premium: true, vip: true },
          { id: 'basic-analytics', name: 'Basic Analytics', free: true, basic: true, premium: true, vip: true },
          { id: 'event-page', name: 'Event Page', free: true, basic: true, premium: true, vip: true },
          { id: 'social-sharing', name: 'Social Media Sharing', free: true, basic: true, premium: true, vip: true },
        ],
        'Marketing Features': [
          { id: 'attendee-mgmt', name: 'Attendee Management', free: false, basic: true, premium: true, vip: true },
          { id: 'promo-tools', name: 'Promotional Tools', free: false, basic: true, premium: true, vip: true },
          { id: 'marketing-analytics', name: 'Marketing Analytics', free: false, basic: false, premium: true, vip: true },
          { id: 'ticket-sales', name: 'Ticket Sales Integration', free: false, basic: false, premium: true, vip: true },
        ],
        'Premium Features': [
          { id: 'priority-support', name: 'Priority Support', free: false, basic: false, premium: true, vip: true },
          { id: 'advanced-reports', name: 'Custom Reports', free: false, basic: false, premium: true, vip: true },
          { id: 'custom-branding', name: 'Custom Branding Options', free: false, basic: false, premium: false, vip: true },
          { id: 'dedicated-rep', name: 'Dedicated Representative', free: false, basic: false, premium: false, vip: true },
        ]
      };
    }
  };
  
  const userFeatures = getUserSpecificFeatures();

  return (
    <Card className={cn("overflow-x-auto", className)}>
      <Table>
        <TableCaption>Feature comparison across subscription tiers for {userType}s</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">Feature</TableHead>
            {tiers.map((tier) => (
              <TableHead 
                key={tier} 
                className={cn(
                  "text-center min-w-[100px]",
                  highlightTier === tier ? "bg-primary/10" : ""
                )}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Loop through each category */}
          {Object.entries(userFeatures).map(([category, features]) => (
            <React.Fragment key={category}>
              <TableRow className="bg-muted/50">
                <TableCell colSpan={tiers.length + 1} className="font-medium">
                  {category}
                </TableCell>
              </TableRow>
              {/* Loop through features in this category */}
              {features.map(feature => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  {tiers.map(tier => (
                    <TableCell key={tier} className="text-center">
                      {feature[tier as keyof typeof feature] ? (
                        <CheckIcon className="h-5 w-5 inline-block text-green-500" />
                      ) : (
                        <XIcon className="h-5 w-5 inline-block text-muted-foreground" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default FeatureTierComparison;
