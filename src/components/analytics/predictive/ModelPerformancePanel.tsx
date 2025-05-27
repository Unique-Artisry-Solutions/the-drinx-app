
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';
import type { PredictiveModel } from '@/services/predictiveAnalyticsService';

interface ModelPerformancePanelProps {
  models: PredictiveModel[];
  isLoading: boolean;
}

const ModelPerformancePanel: React.FC<ModelPerformancePanelProps> = ({
  models,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.8) return 'text-green-600';
    if (accuracy >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getModelIcon = (modelType: string) => {
    switch (modelType) {
      case 'attendance': return TrendingUp;
      case 'revenue': return Target;
      case 'pricing': return BarChart3;
      default: return BarChart3;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Model Performance Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {models.map((model) => {
          const IconComponent = getModelIcon(model.modelType);
          const daysSinceTraining = Math.floor(
            (Date.now() - new Date(model.lastTrained).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return (
            <div key={model.modelType} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium capitalize">
                      {model.modelType} Prediction Model
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last trained {daysSinceTraining} days ago
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={getAccuracyColor(model.accuracy)}>
                  {Math.round(model.accuracy * 100)}% Accurate
                </Badge>
              </div>

              {/* Accuracy Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Model Accuracy</span>
                  <span className={getAccuracyColor(model.accuracy)}>
                    {Math.round(model.accuracy * 100)}%
                  </span>
                </div>
                <Progress value={model.accuracy * 100} className="h-2" />
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">MAPE</div>
                  <div className="font-bold">{model.performance.mape.toFixed(1)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">RMSE</div>
                  <div className="font-bold">{model.performance.rmse.toFixed(1)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">R² Score</div>
                  <div className="font-bold">{model.performance.r2Score.toFixed(3)}</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Key Features</div>
                <div className="flex flex-wrap gap-1">
                  {model.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Overall Health */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">System Health Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Average Accuracy</div>
              <div className="text-lg font-bold text-green-600">
                {Math.round((models.reduce((sum, m) => sum + m.accuracy, 0) / models.length) * 100)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Models Active</div>
              <div className="text-lg font-bold">{models.length}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformancePanel;
