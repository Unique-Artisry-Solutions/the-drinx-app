
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Trophy, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths, addMonths, isToday } from 'date-fns';

interface StreakDay {
  date: Date;
  hasVisit: boolean;
  isToday?: boolean;
}

interface Milestone {
  streak: number;
  reward: string;
  pointsBonus: number;
}

interface EstablishmentSuggestion {
  id: string;
  name: string;
  distance: string;
  streakBonus: number;
}

interface StreakMotivationCardProps {
  currentStreak: number;
  longestStreak: number;
  streakData: StreakDay[];
  className?: string;
}

const StreakMotivationCard: React.FC<StreakMotivationCardProps> = ({
  currentStreak,
  longestStreak,
  streakData,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock milestones
  const milestones: Milestone[] = [
    { streak: 7, reward: 'Free Mocktail', pointsBonus: 50 },
    { streak: 14, reward: 'Premium Tasting', pointsBonus: 100 },
    { streak: 30, reward: 'VIP Circuit Access', pointsBonus: 250 },
    { streak: 60, reward: 'Mixology Class', pointsBonus: 500 },
    { streak: 100, reward: 'Establishment Partner', pointsBonus: 1000 }
  ];

  // Mock streak-safe establishments
  const streakSafeEstablishments: EstablishmentSuggestion[] = [
    { id: '1', name: 'The Zero Proof Bar', distance: '0.3 miles', streakBonus: 10 },
    { id: '2', name: 'Mocktail Haven', distance: '0.5 miles', streakBonus: 15 },
    { id: '3', name: 'Dry Dock Lounge', distance: '0.8 miles', streakBonus: 12 }
  ];

  const getMotivationMessage = (): string => {
    if (currentStreak === 0) return "Start your streak today! Every journey begins with a single visit.";
    if (currentStreak < 7) return `${currentStreak} day streak! Keep going to unlock your first reward.`;
    if (currentStreak < 14) return `Amazing ${currentStreak} day streak! You're building a great habit.`;
    if (currentStreak < 30) return `Incredible ${currentStreak} day streak! You're a true mocktail enthusiast.`;
    return `Legendary ${currentStreak} day streak! You're an inspiration to the community.`;
  };

  const getNextMilestone = (): Milestone | null => {
    return milestones.find(m => m.streak > currentStreak) || null;
  };

  const getFlameIntensity = (): string => {
    if (currentStreak === 0) return 'text-gray-400';
    if (currentStreak < 7) return 'text-orange-400';
    if (currentStreak < 14) return 'text-orange-500';
    if (currentStreak < 30) return 'text-red-500';
    return 'text-red-600';
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{format(currentMonth, 'MMMM yyyy')}</h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-muted-foreground font-medium p-1">
              {day}
            </div>
          ))}
          
          {monthDays.map(day => {
            const dayData = streakData.find(d => isSameDay(d.date, day));
            const hasVisit = dayData?.hasVisit || false;
            const isDayToday = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  text-center p-1 rounded text-xs
                  ${isDayToday ? 'ring-2 ring-spiritless-pink' : ''}
                  ${hasVisit ? 'bg-green-100 text-green-800' : 'text-muted-foreground'}
                  ${isDayToday && hasVisit ? 'bg-green-200' : ''}
                `}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMilestone = getNextMilestone();
  const daysToMilestone = nextMilestone ? nextMilestone.streak - currentStreak : 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className={`h-5 w-5 ${getFlameIntensity()}`} />
          Streak Motivation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Streak Stats */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-spiritless-pink">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-spiritless-blue">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>

        {/* Motivation Message */}
        <div className="text-sm text-center py-2 px-3 bg-muted/50 rounded-lg">
          {getMotivationMessage()}
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-sm flex items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                Next Milestone
              </h5>
              <Badge variant="secondary">{daysToMilestone} days to go</Badge>
            </div>
            <div className="text-sm">
              <div className="font-medium">{nextMilestone.reward}</div>
              <div className="text-muted-foreground">+{nextMilestone.pointsBonus} bonus points</div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-spiritless-pink h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStreak / nextMilestone.streak) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Interactive Calendar */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4" />
            <h5 className="font-medium text-sm">Activity Calendar</h5>
          </div>
          {renderCalendar()}
        </div>

        {/* Streak-Safe Establishments */}
        <div className="space-y-2">
          <h5 className="font-medium text-sm flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Streak-Safe Nearby
          </h5>
          <div className="space-y-2">
            {streakSafeEstablishments.map(establishment => (
              <div 
                key={establishment.id}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-medium text-sm">{establishment.name}</div>
                  <div className="text-xs text-muted-foreground">{establishment.distance}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  +{establishment.streakBonus} pts
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakMotivationCard;
