
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Smartphone, Navigation } from 'lucide-react';
import { MobileConversionMetrics } from '@/services/mobileAnalyticsService';

interface MobileConversionOptimizerProps {
  metrics: MobileConversionMetrics;
  promoterId: string;
}

const MobileConversionOptimizer: React.FC<MobileConversionOptimizerProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Mobile Conversion Optimization</h3>
        <p className="text-sm text-muted-foreground">
          Analyze and optimize mobile user conversion paths
        </p>
      </div>

      {/* Conversion Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Mobile Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {metrics.conversionRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Overall mobile conversion performance
            </p>
            <Badge variant="default" className="mt-2">Above Industry Average</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              ${metrics.averageOrderValue}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Average purchase amount on mobile
            </p>
            <Badge variant="secondary" className="mt-2">+12% vs Web</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile Conversion Funnel</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track user dropoff at each stage of the purchase process
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.funnelDropoff.map((step, index) => (
            <div key={step.step} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{step.step}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {step.users} users
                  </span>
                  {step.dropoffRate > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      -{step.dropoffRate}%
                    </Badge>
                  )}
                </div>
              </div>
              <Progress 
                value={((1000 - (step.dropoffRate * 10)) / 1000) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Device Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Device Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.devicePerformance.map((device) => (
              <div key={device.device} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{device.device}</h4>
                  <Badge variant="outline">{device.conversionRate}% CVR</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance Score</span>
                    <span className="font-medium">{device.performance}/100</span>
                  </div>
                  <Progress value={device.performance} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Journey */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Typical User Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.userJourney.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{step.action}</div>
                  {step.location && (
                    <div className="text-sm text-muted-foreground">
                      Location: {step.location}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Quick Win</h4>
              <p className="text-sm text-green-600">
                Optimize checkout flow - 40% dropoff at payment stage suggests friction
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">A/B Test Opportunity</h4>
              <p className="text-sm text-blue-600">
                Test simplified vs detailed event selection screens
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Performance Boost</h4>
              <p className="text-sm text-purple-600">
                Improve Android app performance - 20% conversion gap vs iOS
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Location Targeting</h4>
              <p className="text-sm text-orange-600">
                Leverage high-performing downtown location data for targeting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileConversionOptimizer;
