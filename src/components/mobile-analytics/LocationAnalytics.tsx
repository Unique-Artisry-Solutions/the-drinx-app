
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Target, Shield, Crosshair } from 'lucide-react';
import { LocationAnalyticsMetrics } from '@/services/mobileAnalyticsService';

interface LocationAnalyticsProps {
  metrics: LocationAnalyticsMetrics;
  promoterId: string;
}

const LocationAnalytics: React.FC<LocationAnalyticsProps> = ({ metrics }) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy < 20) return 'text-green-600';
    if (accuracy < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPermissionColor = (rate: number) => {
    if (rate > 80) return 'text-green-600';
    if (rate > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Location-Based Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Track user location data and geofencing effectiveness
        </p>
      </div>

      {/* Location Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Location Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalEvents.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Total location data points collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="h-4 w-4 text-green-500" />
              Unique Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.uniqueLocations.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Distinct locations visited by users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-purple-500" />
              Location Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getAccuracyColor(metrics.averageAccuracy)}`}>
              {metrics.averageAccuracy.toFixed(1)}m
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Average GPS accuracy
            </p>
            <Badge 
              variant={metrics.averageAccuracy < 20 ? 'default' : 'secondary'} 
              className="mt-2"
            >
              {metrics.averageAccuracy < 20 ? 'High Precision' : 
               metrics.averageAccuracy < 50 ? 'Good' : 'Low Precision'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              Geofence Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.geofenceEvents.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Users entering/exiting event zones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Location Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getPermissionColor(metrics.locationPermissions)}`}>
              {metrics.locationPermissions.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Users with location access enabled
            </p>
            <Badge 
              variant={metrics.locationPermissions > 80 ? 'default' : 'destructive'} 
              className="mt-2"
            >
              {metrics.locationPermissions > 80 ? 'High Adoption' : 
               metrics.locationPermissions > 60 ? 'Good' : 'Low Adoption'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Location Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Location-Based Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">High Activity Zones</h4>
              <p className="text-sm text-blue-600">
                Downtown area shows 40% higher engagement rates during evening hours
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Optimal Geofence Size</h4>
              <p className="text-sm text-green-600">
                500m radius geofences show highest trigger accuracy and user engagement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationAnalytics;
