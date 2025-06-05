
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimpleNavigation } from '@/hooks/useSimpleNavigation';
import { canAccessRoute, isRouteProtected } from '@/utils/simpleRouteProtection';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { CheckCircle, XCircle, Route, Zap, Shield } from 'lucide-react';

const Phase4RoutingPage: React.FC = () => {
  const { goToHome, goToProfile, goTo } = useSimpleNavigation();
  const { userType, isAuthenticated } = useAuth();

  const testRoutes = [
    '/landing',
    '/explore', 
    '/profile',
    '/admin/system-breakdown',
    '/establishment/dashboard',
    '/promoter/dashboard'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-6 w-6" />
            Phase 4: Route Simplification Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium">Simplified Loading</h3>
              <p className="text-sm text-gray-600">Streamlined lazy loading patterns</p>
            </div>
            <div className="text-center">
              <Route className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium">Flattened Routes</h3>
              <p className="text-sm text-gray-600">Single configuration file</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium">Essential Protection</h3>
              <p className="text-sm text-gray-600">Minimal but effective guards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Simplified Navigation Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button onClick={() => goToHome(userType)} variant="outline">
              Go Home
            </Button>
            <Button onClick={() => goToProfile(userType)} variant="outline">
              Go to Profile
            </Button>
            <Button onClick={() => goTo('/explore')} variant="outline">
              Go to Explore
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Route Access Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Route Access Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testRoutes.map(route => {
              const canAccess = canAccessRoute(route, userType, isAuthenticated);
              const isProtected = isRouteProtected(route);
              
              return (
                <div key={route} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {canAccess ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-mono text-sm">{route}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={isProtected ? "destructive" : "secondary"}>
                      {isProtected ? 'Protected' : 'Public'}
                    </Badge>
                    <Badge variant={canAccess ? "default" : "outline"}>
                      {canAccess ? 'Accessible' : 'Blocked'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Phase 4 Implementation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2">✅ Completed</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Flattened route configuration into single file</li>
                  <li>• Simplified lazy loading patterns</li>
                  <li>• Removed unnecessary route complexity</li>
                  <li>• Streamlined protection logic</li>
                  <li>• Created simple navigation hooks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">🚀 Benefits</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Faster route resolution</li>
                  <li>• Easier maintenance</li>
                  <li>• Reduced bundle size</li>
                  <li>• Better performance</li>
                  <li>• Simplified debugging</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase4RoutingPage;
