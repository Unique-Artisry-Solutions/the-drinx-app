
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Trophy, Flame, Lock } from 'lucide-react';

interface QuickStatsWidgetProps {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  isAuthenticated?: boolean;
}

export const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({
  totalMocktailsTried,
  totalPoints,
  currentStreak,
  isAuthenticated = false
}) => {
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Your Stats Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">--</div>
              <p className="text-xs text-muted-foreground">Mocktails Tried</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">--</div>
              <p className="text-xs text-muted-foreground">Points Earned</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">--</div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Sign in to track your mocktail journey and earn points
            </p>
            <Button size="sm" className="w-full">
              Sign In to Unlock Stats
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-2xl font-bold">{totalMocktailsTried}</span>
            </div>
            <p className="text-xs text-muted-foreground">Mocktails Tried</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-2xl font-bold">{totalPoints}</span>
            </div>
            <p className="text-xs text-muted-foreground">Points Earned</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-2xl font-bold">{currentStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
