
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, Compass } from 'lucide-react';

export const UnauthenticatedFallback: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-blue-600" />
            Welcome to Explore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Discover amazing mocktails and establishments. Sign in to unlock personalized recommendations and track your journey.
          </p>
          <div className="flex gap-3">
            <Button className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Mocktails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">• Virgin Mojito</p>
              <p className="text-sm text-muted-foreground">• Shirley Temple</p>
              <p className="text-sm text-muted-foreground">• Virgin Mary</p>
              <p className="text-xs text-blue-600 mt-3">Sign in to see personalized recommendations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Featured Establishments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">• The Sober Lounge</p>
              <p className="text-sm text-muted-foreground">• Zero Proof Bar</p>
              <p className="text-sm text-muted-foreground">• Mocktail Haven</p>
              <p className="text-xs text-blue-600 mt-3">Sign in to save favorites</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
