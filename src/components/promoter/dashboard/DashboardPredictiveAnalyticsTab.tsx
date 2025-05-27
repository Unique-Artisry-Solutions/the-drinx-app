
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics';
import AttendanceForecastPanel from '@/components/analytics/predictive/AttendanceForecastPanel';
import RevenuePredictionPanel from '@/components/analytics/predictive/RevenuePredictionPanel';
import PricingRecommendationPanel from '@/components/analytics/predictive/PricingRecommendationPanel';
import EarlyWarningPanel from '@/components/analytics/predictive/EarlyWarningPanel';
import ModelPerformancePanel from '@/components/analytics/predictive/ModelPerformancePanel';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface DashboardPredictiveAnalyticsTabProps {
  promoterId: string;
}

export const DashboardPredictiveAnalyticsTab: React.FC<DashboardPredictiveAnalyticsTabProps> = ({ 
  promoterId 
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const {
    attendanceForecast,
    revenuePrediction,
    pricingRecommendation,
    earlyWarnings,
    modelPerformance,
    isLoading,
    error,
    refresh,
    generateForecast,
    generatePricing
  } = usePredictiveAnalytics({ promoterId, eventId: selectedEventId });

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const criticalWarnings = earlyWarnings.filter(w => w.severity === 'critical').length;
  const highWarnings = earlyWarnings.filter(w => w.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Predictive Analytics</h2>
          <p className="text-muted-foreground">
            AI-powered insights and forecasting for your events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={refresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge variant="outline" className="text-blue-600">
            AI Powered
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Active Forecasts</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {attendanceForecast ? 1 : 0}
            </div>
            <div className="text-xs text-muted-foreground">
              {attendanceForecast && `${Math.round(attendanceForecast.confidenceLevel * 100)}% confidence`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Revenue Prediction</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {revenuePrediction ? `$${revenuePrediction.predictedRevenue.toLocaleString()}` : '--'}
            </div>
            <div className="text-xs text-muted-foreground">
              Predicted revenue
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Pricing Optimization</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {pricingRecommendation ? `$${pricingRecommendation.recommendedPrice}` : '--'}
            </div>
            <div className="text-xs text-muted-foreground">
              Recommended price
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="text-sm font-medium">Early Warnings</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {criticalWarnings + highWarnings}
            </div>
            <div className="text-xs text-muted-foreground">
              {criticalWarnings > 0 ? `${criticalWarnings} critical` : 'No critical issues'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="forecasting" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="warnings">Early Warnings</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceForecastPanel 
              forecast={attendanceForecast}
              isLoading={isLoading}
              onEventSelect={handleEventSelect}
              onGenerateForecast={generateForecast}
            />
            <RevenuePredictionPanel 
              prediction={revenuePrediction}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <PricingRecommendationPanel 
            recommendation={pricingRecommendation}
            isLoading={isLoading}
            onEventSelect={handleEventSelect}
            onGeneratePricing={generatePricing}
          />
        </TabsContent>

        <TabsContent value="warnings" className="space-y-6">
          <EarlyWarningPanel 
            warnings={earlyWarnings}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <ModelPerformancePanel 
            models={modelPerformance}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  Advanced AI insights and recommendations will be available here
                </div>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
