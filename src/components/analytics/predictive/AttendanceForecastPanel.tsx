
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, Calendar, Target } from 'lucide-react';
import type { AttendanceForecast } from '@/services/predictiveAnalyticsService';

interface AttendanceForecastPanelProps {
  forecast: AttendanceForecast | null;
  isLoading: boolean;
  onEventSelect: (eventId: string) => void;
  onGenerateForecast: (eventId: string) => Promise<void>;
}

const AttendanceForecastPanel: React.FC<AttendanceForecastPanelProps> = ({
  forecast,
  isLoading,
  onEventSelect,
  onGenerateForecast
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance Forecast
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

  if (!forecast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              Select an event to generate attendance forecast
            </div>
            <Button 
              onClick={() => onGenerateForecast('sample-event-id')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Generate Sample Forecast
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const confidenceColor = forecast.confidenceLevel > 0.8 ? 'text-green-600' : 
                         forecast.confidenceLevel > 0.6 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance Forecast
          </div>
          <Badge variant="outline" className={confidenceColor}>
            {Math.round(forecast.confidenceLevel * 100)}% Confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Forecast */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {forecast.predictedAttendance.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Predicted attendees
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Prediction Confidence</span>
            <span className={confidenceColor}>
              {Math.round(forecast.confidenceLevel * 100)}%
            </span>
          </div>
          <Progress 
            value={forecast.confidenceLevel * 100} 
            className="h-2"
          />
        </div>

        {/* Factors Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Influencing Factors
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Historical Trend</div>
              <div className="text-lg font-bold">
                {Math.round(forecast.factors.historicalTrend)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Seasonality</div>
              <div className="text-lg font-bold">
                {forecast.factors.seasonality.toFixed(1)}x
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Marketing Impact</div>
              <div className="text-lg font-bold">
                {forecast.factors.marketingImpact.toFixed(1)}x
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Competition</div>
              <div className="text-lg font-bold">
                {forecast.factors.competition.toFixed(1)}x
              </div>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Forecast for {new Date(forecast.dateRange.startDate).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceForecastPanel;
