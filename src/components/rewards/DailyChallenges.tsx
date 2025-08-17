
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  MapPin, 
  Coffee,
  Users,
  Zap,
  ChevronRight,
  CheckCircle,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'visit' | 'cocktail' | 'social' | 'streak' | 'exploration';
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  target: number;
  pointsReward: number;
  bonusReward?: {
    type: 'achievement' | 'multiplier' | 'item';
    value: string | number;
  };
  timeLimit: string;
  isCompleted: boolean;
  icon: string;
  requirements?: string[];
}

interface DailyChallengesProps {
  className?: string;
  onChallengeComplete?: (challengeId: string) => void;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({
  className,
  onChallengeComplete
}) => {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuthenticatedUser();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  // Generate dynamic challenges based on user history
  const generateDailyChallenges = (): Challenge[] => {
    const baseClasses = [
      {
        id: 'visit-new-venue',
        title: 'Venue Explorer',
        description: 'Visit a new establishment today',
        type: 'visit' as const,
        difficulty: 'easy' as const,
        progress: 0,
        target: 1,
        pointsReward: 50,
        bonusReward: {
          type: 'achievement' as const,
          value: 'Explorer Badge Progress'
        },
        timeLimit: 'Today',
        isCompleted: false,
        icon: 'map-pin',
        requirements: ['Visit any establishment you haven\'t been to before']
      },
      {
        id: 'try-three-cocktails',
        title: 'Cocktail Connoisseur',
        description: 'Sample 3 different mocktails',
        type: 'cocktail' as const,
        difficulty: 'medium' as const,
        progress: 1,
        target: 3,
        pointsReward: 75,
        bonusReward: {
          type: 'multiplier' as const,
          value: 1.5
        },
        timeLimit: 'Today',
        isCompleted: false,
        icon: 'coffee',
        requirements: ['Order 3 different mocktails', 'Must be from different categories']
      },
      {
        id: 'social-sharing',
        title: 'Social Butterfly',
        description: 'Share your experience with friends',
        type: 'social' as const,
        difficulty: 'easy' as const,
        progress: 0,
        target: 2,
        pointsReward: 30,
        timeLimit: 'Today',
        isCompleted: false,
        icon: 'users',
        requirements: ['Share 2 photos or reviews', 'Tag establishment location']
      },
      {
        id: 'maintain-streak',
        title: 'Consistency Master',
        description: 'Maintain your visit streak',
        type: 'streak' as const,
        difficulty: 'hard' as const,
        progress: 1,
        target: 1,
        pointsReward: 100,
        bonusReward: {
          type: 'achievement' as const,
          value: 'Streak Guardian'
        },
        timeLimit: 'Today',
        isCompleted: false,
        icon: 'zap',
        requirements: ['Visit at least one establishment today', 'Don\'t break your current streak']
      },
      {
        id: 'discovery-quest',
        title: 'Hidden Gems',
        description: 'Discover venues off the beaten path',
        type: 'exploration' as const,
        difficulty: 'medium' as const,
        progress: 0,
        target: 2,
        pointsReward: 90,
        bonusReward: {
          type: 'item' as const,
          value: 'Explorer\'s Map'
        },
        timeLimit: 'Today',
        isCompleted: false,
        icon: 'target',
        requirements: ['Visit 2 establishments rated below 4.5 stars', 'Leave honest reviews']
      }
    ];

    // Randomize and select 3-4 challenges for today
    const shuffled = baseClasses.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 3);
  };

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      
      if (isAuthenticated) {
        // Generate personalized challenges
        const dailyChallenges = generateDailyChallenges();
        setChallenges(dailyChallenges);
      } else {
        // Show sample challenges for guest users
        const guestChallenges = generateDailyChallenges().slice(0, 2);
        setChallenges(guestChallenges);
      }
      
      setLoading(false);
    };

    loadChallenges();
  }, [isAuthenticated, user]);

  const getIcon = (iconName: string) => {
    const iconMap = {
      'map-pin': MapPin,
      'coffee': Coffee,
      'users': Users,
      'zap': Zap,
      'target': Target,
      'trophy': Trophy
    };
    return iconMap[iconName as keyof typeof iconMap] || Target;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleChallengeAction = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              progress: Math.min(challenge.progress + 1, challenge.target),
              isCompleted: challenge.progress + 1 >= challenge.target
            }
          : challenge
      )
    );

    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.progress + 1 >= challenge.target) {
      onChallengeComplete?.(challengeId);
    }
  };

  const completedChallenges = challenges.filter(c => c.isCompleted).length;
  const totalPoints = challenges.reduce((sum, c) => sum + (c.isCompleted ? c.pointsReward : 0), 0);

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader className="pb-3">
          <div className="h-6 bg-muted rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            Daily Challenges
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {completedChallenges}/{challenges.length}
            </Badge>
            {totalPoints > 0 && (
              <Badge className="bg-amber-500 text-white text-xs">
                <Star className="h-3 w-3 mr-1" />
                +{totalPoints}
              </Badge>
            )}
          </div>
        </div>
        
        {challenges.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Daily Progress</span>
              <span>{Math.round((completedChallenges / challenges.length) * 100)}%</span>
            </div>
            <Progress 
              value={(completedChallenges / challenges.length) * 100} 
              className="h-2"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              Sign in to unlock personalized daily challenges and earn rewards!
            </p>
          </div>
        )}

        <div className="space-y-3">
          {challenges.map((challenge) => {
            const Icon = getIcon(challenge.icon);
            const progressPercentage = (challenge.progress / challenge.target) * 100;
            const isExpanded = expandedChallenge === challenge.id;

            return (
              <div
                key={challenge.id}
                className={cn(
                  "border rounded-lg p-3 transition-all duration-200",
                  challenge.isCompleted 
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
                    : "bg-card border-border hover:border-spiritless-pink/50"
                )}
              >
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedChallenge(isExpanded ? null : challenge.id)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "p-2 rounded-lg",
                      challenge.isCompleted ? "bg-green-500" : "bg-spiritless-pink/10"
                    )}>
                      {challenge.isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Icon className="h-4 w-4 text-spiritless-pink" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{challenge.title}</h4>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          getDifficultyColor(challenge.difficulty)
                        )} />
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {challenge.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xs">
                            <span className="font-medium">{challenge.progress}</span>
                            <span className="text-muted-foreground">/{challenge.target}</span>
                          </div>
                          
                          <div className="flex-1 max-w-[100px]">
                            <Progress value={progressPercentage} className="h-1" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-xs text-amber-600">
                            <Star className="h-3 w-3 mr-1" />
                            {challenge.pointsReward}
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {challenge.timeLimit}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-border">
                    {challenge.requirements && (
                      <div className="mb-3">
                        <h5 className="text-xs font-medium mb-2">Requirements:</h5>
                        <ul className="space-y-1">
                          {challenge.requirements.map((req, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start">
                              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {challenge.bonusReward && (
                      <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center text-xs text-amber-700 dark:text-amber-300">
                          <Gift className="h-3 w-3 mr-1" />
                          <span className="font-medium">Bonus: </span>
                          <span className="ml-1">{challenge.bonusReward.value}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={challenge.isCompleted ? "secondary" : "default"}
                        className="flex-1 text-xs h-8"
                        disabled={challenge.isCompleted}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!challenge.isCompleted) {
                            handleChallengeAction(challenge.id);
                          }
                        }}
                      >
                        {challenge.isCompleted ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Target className="h-3 w-3 mr-1" />
                            Take Action
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-6">
            <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No challenges available right now. Check back tomorrow!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyChallenges;
