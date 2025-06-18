
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { Calendar, Target, Trophy, Zap } from 'lucide-react';

const DailyChallenges = () => {
  const { isAuthenticated } = useDevAuthBypass();

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to view daily challenges</p>
        </CardContent>
      </Card>
    );
  }

  const challenges = [
    {
      id: 1,
      title: "Try 3 New Mocktails",
      description: "Discover new flavors at different establishments",
      progress: 1,
      target: 3,
      points: 50,
      icon: Target,
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "Visit 2 New Venues",
      description: "Explore establishments you haven't been to before",
      progress: 0,
      target: 2,
      points: 100,
      icon: Calendar,
      difficulty: "Medium"
    },
    {
      id: 3,
      title: "Complete a Bar Crawl",
      description: "Join or create a bar crawl with friends",
      progress: 0,
      target: 1,
      points: 200,
      icon: Trophy,
      difficulty: "Hard"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Daily Challenges</h3>
      </div>
      
      {challenges.map((challenge) => {
        const progressPercentage = (challenge.progress / challenge.target) * 100;
        const Icon = challenge.icon;
        
        return (
          <Card key={challenge.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <Badge variant={challenge.difficulty === 'Easy' ? 'secondary' : challenge.difficulty === 'Medium' ? 'default' : 'destructive'}>
                  {challenge.points} pts
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Progress: {challenge.progress}/{challenge.target}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {challenge.difficulty}
                  </Badge>
                </div>
                
                <Progress value={progressPercentage} className="h-2" />
                
                {progressPercentage === 100 ? (
                  <Button className="w-full" size="sm">
                    <Trophy className="h-3 w-3 mr-1" />
                    Claim Reward
                  </Button>
                ) : (
                  <div className="text-xs text-muted-foreground text-center">
                    Complete to earn {challenge.points} points
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DailyChallenges;
