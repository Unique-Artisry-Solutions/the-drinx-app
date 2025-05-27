
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, MapPin, Coffee, Users } from 'lucide-react';

interface ActivitySegment {
  type: 'visits' | 'cocktails' | 'establishments' | 'events';
  label: string;
  current: number;
  target: number;
  color: string;
  icon: React.ReactNode;
}

interface DiscoveryProgressRingProps {
  period: 'weekly' | 'monthly';
  segments: ActivitySegment[];
  className?: string;
}

const DiscoveryProgressRing: React.FC<DiscoveryProgressRingProps> = ({
  period,
  segments,
  className = ''
}) => {
  const radius = 60;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculate total progress
  const totalProgress = segments.reduce((acc, segment) => {
    return acc + Math.min(segment.current / segment.target, 1);
  }, 0) / segments.length;

  const renderSegment = (segment: ActivitySegment, index: number) => {
    const progress = Math.min(segment.current / segment.target, 1);
    const strokeDasharray = `${progress * circumference} ${circumference}`;
    const rotation = (index * 90) - 90; // Start from top and rotate 90 degrees for each segment
    
    return (
      <motion.circle
        key={segment.type}
        stroke={segment.color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        style={{
          strokeDashoffset: 0,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: '50% 50%',
          strokeLinecap: 'round'
        }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        initial={{ strokeDasharray: `0 ${circumference}` }}
        animate={{ strokeDasharray }}
        transition={{ 
          duration: 1.5, 
          delay: index * 0.2,
          ease: "easeInOut" 
        }}
      />
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          {period === 'weekly' ? 'Weekly' : 'Monthly'} Discovery Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Ring */}
        <div className="flex justify-center">
          <div className="relative">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                stroke="#e5e7eb"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              
              {/* Progress segments */}
              {segments.map((segment, index) => renderSegment(segment, index))}
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-foreground"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {Math.round(totalProgress * 100)}%
                </motion.div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Segment Details */}
        <div className="space-y-2">
          {segments.map((segment, index) => {
            const progress = Math.min(segment.current / segment.target, 1);
            const isComplete = segment.current >= segment.target;
            
            return (
              <motion.div
                key={segment.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.8 }}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <div className="flex items-center gap-1">
                    {segment.icon}
                    <span className="text-sm font-medium">{segment.label}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {segment.current}/{segment.target}
                  </span>
                  {isComplete && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Complete!
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Next Goal Suggestion */}
        {totalProgress < 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
          >
            <div className="text-sm font-medium text-blue-900 mb-1">
              Next Goal Suggestion
            </div>
            <div className="text-xs text-blue-700">
              {getNextGoalSuggestion(segments)}
            </div>
          </motion.div>
        )}

        {/* Achievement Badge for Completion */}
        {totalProgress === 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
            className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 text-center"
          >
            <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-1" />
            <div className="text-sm font-medium text-amber-900">
              {period === 'weekly' ? 'Weekly' : 'Monthly'} Goals Complete!
            </div>
            <div className="text-xs text-amber-700">
              You've achieved all your discovery goals. Great job! 🎉
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

const getNextGoalSuggestion = (segments: ActivitySegment[]): string => {
  const incompleteSegments = segments.filter(s => s.current < s.target);
  
  if (incompleteSegments.length === 0) return "All goals complete!";
  
  // Find the segment closest to completion
  const nextGoal = incompleteSegments.reduce((closest, current) => {
    const closestProgress = closest.current / closest.target;
    const currentProgress = current.current / current.target;
    return currentProgress > closestProgress ? current : closest;
  });
  
  const remaining = nextGoal.target - nextGoal.current;
  
  switch (nextGoal.type) {
    case 'visits':
      return `Visit ${remaining} more ${remaining === 1 ? 'establishment' : 'establishments'} to complete this goal`;
    case 'cocktails':
      return `Try ${remaining} more ${remaining === 1 ? 'cocktail' : 'cocktails'} to reach your target`;
    case 'establishments':
      return `Discover ${remaining} more ${remaining === 1 ? 'establishment' : 'establishments'} in your area`;
    case 'events':
      return `Attend ${remaining} more ${remaining === 1 ? 'event' : 'events'} to complete this goal`;
    default:
      return "Keep exploring to reach your next goal!";
  }
};

// Default props for easy usage
export const createMockDiscoveryData = (): ActivitySegment[] => [
  {
    type: 'visits',
    label: 'Check-ins',
    current: 8,
    target: 12,
    color: '#10b981', // green-500
    icon: <MapPin className="h-4 w-4" />
  },
  {
    type: 'cocktails',
    label: 'Cocktails Tried',
    current: 5,
    target: 8,
    color: '#f59e0b', // amber-500
    icon: <Coffee className="h-4 w-4" />
  },
  {
    type: 'establishments',
    label: 'New Places',
    current: 3,
    target: 5,
    color: '#8b5cf6', // purple-500
    icon: <Users className="h-4 w-4" />
  },
  {
    type: 'events',
    label: 'Events Attended',
    current: 2,
    target: 3,
    color: '#06b6d4', // cyan-500
    icon: <Trophy className="h-4 w-4" />
  }
];

export default DiscoveryProgressRing;
