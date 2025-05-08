
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
}

/**
 * A component that displays a side-by-side comparison of features across different subscription tiers
 */
const FeatureTierComparison: React.FC<FeatureTierComparisonProps> = ({
  showAllFeatures = false,
  highlightTier,
  className,
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

  return (
    <Card className={cn("overflow-x-auto", className)}>
      <Table>
        <TableCaption>Feature comparison across subscription tiers</TableCaption>
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
          {Object.entries(categories).map(([category, features]) => (
            <React.Fragment key={category}>
              <TableRow className="bg-muted/50">
                <TableCell colSpan={tiers.length + 1} className="font-medium">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TableCell>
              </TableRow>
              {/* Loop through features in this category */}
              {features.map(feature => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {feature.name}
                    {feature.isExperimental && (
                      <Badge variant="outline" className="ml-2">Beta</Badge>
                    )}
                  </TableCell>
                  {tiers.map(tier => {
                    const tierFeatures = featuresByTier[tier] || [];
                    const isIncluded = tierFeatures.includes(feature.id);
                    
                    return (
                      <TableCell key={tier} className="text-center">
                        {isIncluded ? (
                          <CheckIcon className="h-5 w-5 inline-block text-green-500" />
                        ) : (
                          <XIcon className="h-5 w-5 inline-block text-muted-foreground" />
                        )}
                      </TableCell>
                    );
                  })}
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
