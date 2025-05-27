
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  Users, 
  Share2, 
  Info,
  Ticket,
  Clock
} from 'lucide-react';

interface EventFeatureHeatMapProps {
  eventId: string;
}

interface FeatureHeatData {
  feature: string;
  icon: React.ElementType;
  interactions: number;
  clicks: number;
  timeSpent: string;
  conversionRate: number;
  heatLevel: 'low' | 'medium' | 'high' | 'very-high';
}

const EventFeatureHeatMap: React.FC<EventFeatureHeatMapProps> = ({ eventId }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock heat map data - in production, this would come from API
  const featureHeatData: FeatureHeatData[] = [
    {
      feature: 'Ticket Purchase',
      icon: Ticket,
      interactions: 1240,
      clicks: 890,
      timeSpent: '3m 45s',
      conversionRate: 71.8,
      heatLevel: 'very-high'
    },
    {
      feature: 'Event Details',
      icon: Info,
      interactions: 2100,
      clicks: 1560,
      timeSpent: '2m 12s',
      conversionRate: 74.3,
      heatLevel: 'very-high'
    },
    {
      feature: 'Schedule/Agenda',
      icon: Calendar,
      interactions: 980,
      clicks: 720,
      timeSpent: '1m 48s',
      conversionRate: 73.5,
      heatLevel: 'high'
    },
    {
      feature: 'Venue Information',
      icon: MapPin,
      interactions: 750,
      clicks: 540,
      timeSpent: '1m 22s',
      conversionRate: 72.0,
      heatLevel: 'high'
    },
    {
      feature: 'Social Sharing',
      icon: Share2,
      interactions: 420,
      clicks: 315,
      timeSpent: '45s',
      conversionRate: 75.0,
      heatLevel: 'medium'
    },
    {
      feature: 'Attendee List',
      icon: Users,
      interactions: 310,
      clicks: 280,
      timeSpent: '1m 05s',
      conversionRate: 90.3,
      heatLevel: 'medium'
    },
    {
      feature: 'Payment Options',
      icon: CreditCard,
      interactions: 200,
      clicks: 180,
      timeSpent: '2m 30s',
      conversionRate: 90.0,
      heatLevel: 'medium'
    },
    {
      feature: 'Event Timer',
      icon: Clock,
      interactions: 150,
      clicks: 120,
      timeSpent: '30s',
      conversionRate: 80.0,
      heatLevel: 'low'
    }
  ];

  const getHeatColor = (level: string): string => {
    switch (level) {
      case 'very-high': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getHeatIntensity = (level: string): string => {
    switch (level) {
      case 'very-high': return 'opacity-90';
      case 'high': return 'opacity-70';
      case 'medium': return 'opacity-50';
      case 'low': return 'opacity-30';
      default: return 'opacity-20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Feature Interaction Heat Map</h3>
          <p className="text-sm text-muted-foreground">
            Visualize user engagement with different event features
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
        </div>
      </div>

      {/* Heat Map Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium">Heat Intensity:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 opacity-30 rounded" />
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 opacity-50 rounded" />
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 opacity-70 rounded" />
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 opacity-90 rounded" />
                <span className="text-xs">Very High</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heat Map Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureHeatData.map((feature) => (
            <Card key={feature.feature} className="relative overflow-hidden">
              <div 
                className={`absolute inset-0 ${getHeatColor(feature.heatLevel)} ${getHeatIntensity(feature.heatLevel)}`}
              />
              <CardContent className="relative p-4">
                <div className="flex items-center gap-2 mb-3">
                  <feature.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{feature.feature}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="font-medium">{feature.interactions}</span> interactions
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">{feature.clicks}</span> clicks
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">{feature.timeSpent}</span> avg time
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.conversionRate}% conversion
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {featureHeatData.map((feature) => (
                <div key={feature.feature} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <feature.icon className="h-5 w-5" />
                        <span className="font-medium">{feature.feature}</span>
                      </div>
                      <div 
                        className={`w-3 h-3 rounded-full ${getHeatColor(feature.heatLevel)} ${getHeatIntensity(feature.heatLevel)}`}
                      />
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{feature.interactions}</div>
                        <div className="text-xs text-muted-foreground">Interactions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{feature.clicks}</div>
                        <div className="text-xs text-muted-foreground">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{feature.timeSpent}</div>
                        <div className="text-xs text-muted-foreground">Time Spent</div>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary">
                          {feature.conversionRate}%
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">Conversion</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Most Engaged Feature</h4>
              <p className="text-sm text-muted-foreground">
                Event Details has the highest interaction rate with 2,100 total interactions
                and 74.3% conversion rate.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Optimization Opportunity</h4>
              <p className="text-sm text-muted-foreground">
                Event Timer has low engagement. Consider making it more prominent or 
                adding interactive countdown features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventFeatureHeatMap;
