
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingRecommendationPanelProps {
  data?: any;
  isLoading?: boolean;
}

const mockRecommendations = [
  {
    event: 'Summer Mixology Workshop',
    currentPrice: 45,
    recommendedPrice: 52,
    confidence: 85,
    reason: 'High demand expected based on similar events'
  },
  {
    event: 'Happy Hour Special',
    currentPrice: 25,
    recommendedPrice: 23,
    confidence: 72,
    reason: 'Price sensitivity analysis suggests lower price will increase volume'
  },
  {
    event: 'Weekend Tasting',
    currentPrice: 35,
    recommendedPrice: 38,
    confidence: 91,
    reason: 'Market analysis shows premium pricing opportunity'
  }
];

const PricingRecommendationPanel: React.FC<PricingRecommendationPanelProps> = ({ 
  data, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecommendations.map((rec, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{rec.event}</h4>
                <Badge variant={rec.confidence > 80 ? 'default' : 'secondary'}>
                  {rec.confidence}% confidence
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Current: ${rec.currentPrice}</span>
                <span>→</span>
                <span className="font-medium text-green-600">Recommended: ${rec.recommendedPrice}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{rec.reason}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingRecommendationPanel;
