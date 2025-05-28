
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Achievement, achievementCategories } from '@/types/rewards';
import { Award, Check, MapPin, GlassWater, Users, PenTool, Route } from 'lucide-react';

interface AchievementsListProps {
  achievements: Achievement[];
  achievementsByCategory: Record<string, Achievement[]>;
  isLoading?: boolean;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ 
  achievements, 
  achievementsByCategory, 
  isLoading = false 
}) => {
  // Get the icon component for each achievement
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="h-5 w-5 text-amber-500" />;
      case 'MapPin': 
      case 'map-pin': return <MapPin className="h-5 w-5 text-blue-500" />;
      case 'GlassWater': 
      case 'glass-water': return <GlassWater className="h-5 w-5 text-cyan-500" />;
      case 'Users': return <Users className="h-5 w-5 text-indigo-500" />;
      case 'PenTool': return <PenTool className="h-5 w-5 text-violet-500" />;
      case 'Route': return <Route className="h-5 w-5 text-green-500" />;
      case 'star': return <Award className="h-5 w-5 text-yellow-500" />;
      default: return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded-md" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate the number of completed achievements
  const completedCount = achievements.filter(a => a.isCompleted).length;
  const totalCount = achievements.length;
  const completedPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Achievements</CardTitle>
          <Badge variant="outline" className="gap-1">
            <Check className="h-3.5 w-3.5" />
            {completedCount}/{totalCount} Completed
          </Badge>
        </div>
        <CardDescription>
          Your journey through the world of mocktails
        </CardDescription>
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{completedPercentage}%</span>
          </div>
          <Progress value={completedPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={achievementCategories[0]?.id || 'visits'}>
          <TabsList className="grid grid-cols-5 mb-4">
            {achievementCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {achievementCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {(achievementsByCategory[category.id] || []).map((achievement) => (
                    <Card key={achievement.id} className={`relative overflow-hidden ${achievement.isCompleted ? 'border-amber-300 bg-amber-50/50' : ''}`}>
                      {achievement.isCompleted && (
                        <div className="absolute top-0 right-0 p-1 bg-amber-100 rounded-bl-md">
                          <Check className="h-4 w-4 text-amber-600" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-full ${achievement.isCompleted ? 'bg-amber-100' : 'bg-muted'}`}>
                            {getIcon(achievement.icon)}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{achievement.name}</h4>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <div className="flex gap-1">
                              <span className="font-medium">{achievement.progress}</span>
                              <span className="text-muted-foreground">/ {achievement.threshold}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              +{achievement.pointsReward} pts
                            </Badge>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.threshold) * 100} 
                            className="h-1.5"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
