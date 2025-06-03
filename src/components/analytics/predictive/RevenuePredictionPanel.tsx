
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { RevenuePrediction } from '@/services/predictiveAnalyticsService';

interface RevenuePredictionPanelProps {
  prediction: RevenuePrediction | null;
  isLoading: boolean;
}

const RevenuePredictionPanel: React.FC<RevenuePredictionPanelProps> = ({
  prediction,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Prediction
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

  if (!prediction) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Generate attendance forecast to see revenue prediction
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Prediction */}
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            ${prediction.predictedRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Predicted revenue
          </div>
        </div>

        {/* Scenarios */}
        <div className="space-y-3">
          <h4 className="font-medium">Revenue Scenarios</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">Optimistic</span>
              </div>
              <div className="font-bold text-green-600">
                ${prediction.scenarios.optimistic.toLocaleString()}
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">Realistic</span>
              </div>
              <div className="font-bold text-blue-600">
                ${prediction.scenarios.realistic.toLocaleString()}
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Pessimistic</span>
              </div>
              <div className="font-bold text-orange-600">
                ${prediction.scenarios.pessimistic.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Factor Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium">Key Factors</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Avg Ticket Price</div>
              <div className="text-lg font-bold">
                ${prediction.factors.ticketPricing.toFixed(0)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Expected Attendance</div>
              <div className="text-lg font-bold">
                {prediction.factors.attendanceForecast}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenuePredictionPanel;
