
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, DollarSign, TrendingUp, Users } from 'lucide-react';
import type { PricingRecommendation } from '@/services/predictiveAnalyticsService';

interface PricingRecommendationPanelProps {
  recommendation: PricingRecommendation | null;
  isLoading: boolean;
  onEventSelect: (eventId: string) => void;
  onGeneratePricing: (eventId: string) => Promise<void>;
}

const PricingRecommendationPanel: React.FC<PricingRecommendationPanelProps> = ({
  recommendation,
  isLoading,
  onEventSelect,
  onGeneratePricing
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pricing Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!recommendation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pricing Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              Select an event to generate pricing recommendations
            </div>
            <Button 
              onClick={() => onGeneratePricing('sample-event-id')}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Generate Sample Pricing
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStrategyBadgeColor = (strategy: string) => {
    switch (strategy) {
      case 'skimming': return 'text-purple-600 bg-purple-50';
      case 'penetration': return 'text-green-600 bg-green-50';
      case 'competitive': return 'text-blue-600 bg-blue-50';
      case 'value-based': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pricing Optimization
          </div>
          <Badge className={getStrategyBadgeColor(recommendation.strategy)}>
            {recommendation.strategy.charAt(0).toUpperCase() + recommendation.strategy.slice(1)} Strategy
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Recommendation */}
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            ${recommendation.recommendedPrice}
          </div>
          <div className="text-sm text-muted-foreground">
            Recommended price per ticket
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Optimal Price Range</h4>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Minimum</div>
              <div className="text-lg font-bold">${recommendation.priceRange.min}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Recommended</div>
              <div className="text-lg font-bold text-purple-600">
                ${recommendation.recommendedPrice}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Maximum</div>
              <div className="text-lg font-bold">${recommendation.priceRange.max}</div>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="space-y-4">
          <h4 className="font-medium">Pricing Analysis</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Demand Level</span>
                <Badge variant="outline" className={getDemandColor(recommendation.reasoning.demandLevel)}>
                  {recommendation.reasoning.demandLevel}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Competitor Avg</span>
                <span className="font-medium">${recommendation.reasoning.competitorPricing.toFixed(0)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Price Elasticity</span>
                <span className="font-medium">{recommendation.reasoning.elasticity.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Revenue Impact</span>
                <span className="font-medium text-green-600">
                  ${recommendation.reasoning.revenueImpact.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Explanation */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Strategy Rationale</h4>
          <p className="text-sm text-blue-700">
            {recommendation.strategy === 'skimming' && 
              'High demand and low price sensitivity suggest a premium pricing approach to maximize revenue.'}
            {recommendation.strategy === 'penetration' && 
              'Lower prices recommended to stimulate demand and gain market share.'}
            {recommendation.strategy === 'competitive' && 
              'Price aligned with market standards to remain competitive while maintaining margins.'}
            {recommendation.strategy === 'value-based' && 
              'Pricing based on perceived value and unique event attributes.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingRecommendationPanel;
