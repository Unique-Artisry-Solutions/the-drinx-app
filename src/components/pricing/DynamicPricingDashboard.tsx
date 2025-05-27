
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDynamicPricing } from '@/hooks/pricing/useDynamicPricing';
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Target } from 'lucide-react';

interface DynamicPricingDashboardProps {
  eventId?: string;
  swigCircuitId?: string;
  basePrice: number;
  onPriceUpdate?: (newPrice: number) => void;
}

export const DynamicPricingDashboard: React.FC<DynamicPricingDashboardProps> = ({
  eventId,
  swigCircuitId,
  basePrice,
  onPriceUpdate
}) => {
  const {
    demandAnalysis,
    dynamicPricing,
    pricingStrategy,
    isLoading,
    confidence,
    updateDemandMetrics
  } = useDynamicPricing(eventId, swigCircuitId, basePrice);

  const handleApplyPrice = () => {
    if (dynamicPricing?.finalPrice && onPriceUpdate) {
      onPriceUpdate(dynamicPricing.finalPrice);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const priceChange = dynamicPricing ? dynamicPricing.finalPrice - dynamicPricing.originalPrice : 0;
  const priceChangePercentage = dynamicPricing?.adjustmentPercentage || 0;

  return (
    <div className="space-y-6">
      {/* Current Pricing Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dynamicPricing?.finalPrice?.toFixed(2) || basePrice.toFixed(2)}</div>
            {priceChange !== 0 && (
              <div className="flex items-center space-x-1">
                {priceChange > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${priceChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange > 0 ? '+' : ''}${Math.abs(priceChange).toFixed(2)} ({priceChangePercentage > 0 ? '+' : ''}{priceChangePercentage.toFixed(1)}%)
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(demandAnalysis?.demandScore || 0)}</div>
            <Progress value={demandAnalysis?.demandScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Velocity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandAnalysis?.salesVelocity || 0}</div>
            <p className="text-xs text-muted-foreground">Sales in last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confidence}%</div>
            <Progress value={confidence} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Pricing Strategy */}
      {pricingStrategy && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant={
                pricingStrategy.currentStrategy === 'Premium pricing' ? 'default' :
                pricingStrategy.currentStrategy === 'Promotional pricing' ? 'destructive' :
                'secondary'
              }>
                {pricingStrategy.currentStrategy}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {pricingStrategy.expectedImpact}
              </p>
            </div>
            
            {pricingStrategy.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {pricingStrategy.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Applied Rules */}
      {dynamicPricing && dynamicPricing.appliedRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Applied Pricing Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dynamicPricing.appliedRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{rule}</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
            {dynamicPricing.reasoning.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Pricing Logic:</h4>
                <ul className="space-y-1">
                  {dynamicPricing.reasoning.map((reason, index) => (
                    <li key={index} className="text-xs text-muted-foreground">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {dynamicPricing && Math.abs(priceChangePercentage) > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Recommended Price Update</h4>
                <p className="text-sm text-muted-foreground">
                  Update from ${basePrice.toFixed(2)} to ${dynamicPricing.finalPrice.toFixed(2)}
                </p>
              </div>
              <Button onClick={handleApplyPrice}>
                Apply New Price
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
