
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Target, CheckCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  progress: number;
  total: number;
  pointsReward: number;
  icon: string;
  urgency: 'low' | 'medium' | 'high';
  suggestion?: string;
  estimatedCompletion?: string;
}

interface AchievementProximityAlertsProps {
  className?: string;
  userLocation?: { lat: number; lng: number };
  currentActivity?: string;
  achievements?: Achievement[];
  onAchievementComplete?: (achievementId: string) => void;
}

const AchievementProximityAlerts: React.FC<AchievementProximityAlertsProps> = ({
  className,
  userLocation,
  currentActivity,
  achievements,
  onAchievementComplete
}) => {
  const [proximityAchievements, setProximityAchievements] = useState<Achievement[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [celebratingAchievements, setCelebratingAchievements] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Mock achievement data - in real app this would come from API
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: 'Social Explorer',
      description: 'Visit 10 different establishments',
      category: 'visits',
      progress: 8,
      total: 10,
      pointsReward: 100,
      icon: 'map-pin',
      urgency: 'high',
      suggestion: 'Visit 2 more establishments nearby',
      estimatedCompletion: '15 minutes'
    },
    {
      id: '2',
      name: 'Mocktail Master',
      description: 'Try 15 different mocktails',
      category: 'mocktails',
      progress: 12,
      total: 15,
      pointsReward: 150,
      icon: 'glass-water',
      urgency: 'medium',
      suggestion: 'Order 3 more unique mocktails',
      estimatedCompletion: '30 minutes'
    },
    {
      id: '3',
      name: 'Weekend Warrior',
      description: 'Complete 3 activities this weekend',
      category: 'special',
      progress: 2,
      total: 3,
      pointsReward: 75,
      icon: 'star',
      urgency: 'high',
      suggestion: 'One more activity before Sunday ends!',
      estimatedCompletion: '5 minutes'
    }
  ];

  // Filter achievements that are close to completion (80%+ progress)
  useEffect(() => {
    const achievementsToUse = achievements || mockAchievements;
    const proximityThreshold = 0.8;
    
    const nearby = achievementsToUse.filter(achievement => {
      const progressPercentage = achievement.progress / achievement.total;
      const isNotDismissed = !dismissedAlerts.has(achievement.id);
      const isNotCompleted = progressPercentage < 1;
      
      return progressPercentage >= proximityThreshold && isNotDismissed && isNotCompleted;
    });

    setProximityAchievements(nearby);
  }, [achievements, dismissedAlerts]);

  // Simulate achievement completion when progress reaches 100%
  useEffect(() => {
    proximityAchievements.forEach(achievement => {
      if (achievement.progress >= achievement.total && !celebratingAchievements.has(achievement.id)) {
        handleAchievementComplete(achievement);
      }
    });
  }, [proximityAchievements, celebratingAchievements]);

  const handleAchievementComplete = (achievement: Achievement) => {
    setCelebratingAchievements(prev => new Set([...prev, achievement.id]));
    
    // Show celebration toast
    toast({
      title: "🎉 Achievement Unlocked!",
      description: (
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <div>
            <p className="font-medium">{achievement.name}</p>
            <p className="text-sm text-muted-foreground">+{achievement.pointsReward} points earned!</p>
          </div>
        </div>
      ),
      duration: 5000,
    });

    // Call parent handler
    onAchievementComplete?.(achievement.id);

    // Remove from proximity after celebration
    setTimeout(() => {
      setDismissedAlerts(prev => new Set([...prev, achievement.id]));
      setCelebratingAchievements(prev => {
        const newSet = new Set(prev);
        newSet.delete(achievement.id);
        return newSet;
      });
    }, 3000);
  };

  const dismissAlert = (achievementId: string) => {
    setDismissedAlerts(prev => new Set([...prev, achievementId]));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'map-pin':
        return <Target className="h-4 w-4" />;
      case 'glass-water':
        return <Star className="h-4 w-4" />;
      case 'star':
        return <Flame className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (proximityAchievements.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <AnimatePresence mode="popLayout">
        {proximityAchievements.map((achievement) => {
          const progressPercentage = (achievement.progress / achievement.total) * 100;
          const isCelebrating = celebratingAchievements.has(achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: isCelebrating ? [1, 1.05, 1] : 1,
                rotateY: isCelebrating ? [0, 10, 0] : 0
              }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                scale: { repeat: isCelebrating ? 2 : 0, duration: 0.6 }
              }}
              className="relative"
            >
              <Card className={cn(
                "border-l-4 transition-all duration-300",
                getUrgencyColor(achievement.urgency),
                isCelebrating && "shadow-lg ring-2 ring-amber-400 ring-opacity-50"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full",
                        achievement.urgency === 'high' ? 'bg-red-100 text-red-600' :
                        achievement.urgency === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      )}>
                        {isCelebrating ? <CheckCircle className="h-4 w-4" /> : getIcon(achievement.icon)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            +{achievement.pointsReward} pts
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{achievement.progress}/{achievement.total}</span>
                            <span className="font-medium">{Math.round(progressPercentage)}%</span>
                          </div>
                          <Progress 
                            value={progressPercentage} 
                            className="h-1.5"
                          />
                        </div>
                        
                        {achievement.suggestion && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-muted/30 rounded-md">
                            <Target className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              {achievement.suggestion}
                            </p>
                            {achievement.estimatedCompletion && (
                              <Badge variant="outline" className="text-xs ml-auto">
                                ~{achievement.estimatedCompletion}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isCelebrating && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(achievement.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Celebration particles effect */}
              {isCelebrating && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        opacity: 1,
                        scale: 0,
                        x: '50%',
                        y: '50%'
                      }}
                      animate={{ 
                        opacity: 0,
                        scale: 1,
                        x: `${50 + (Math.random() - 0.5) * 200}%`,
                        y: `${50 + (Math.random() - 0.5) * 200}%`
                      }}
                      transition={{ 
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                      className="absolute w-2 h-2 bg-amber-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AchievementProximityAlerts;
