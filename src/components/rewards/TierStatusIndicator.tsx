
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface TierStatusIndicatorProps {
  currentTier: number;
  points: number;
}

export function TierStatusIndicator({ currentTier, points }: TierStatusIndicatorProps) {
  // Determine points needed for next tier
  const pointsForNextTier = currentTier * 1000; // Example calculation
  const nextTierPoints = currentTier * 1000 + 1000;
  
  // Calculate progress percentage toward next tier
  const progressToNextTier = Math.min(((points - pointsForNextTier) / 1000) * 100, 100);
  
  // Determine the tier name based on the current tier
  const tierName = () => {
    switch(currentTier) {
      case 1: return "Bronze";
      case 2: return "Silver";
      case 3: return "Gold";
      case 4: return "Platinum";
      default: return "Diamond";
    }
  };
  
  // Calculate remaining points needed for next tier
  const remainingPoints = nextTierPoints - points;

  return (
    <Card className="overflow-hidden shadow-md border-t-4 border-t-primary">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2 bg-primary/10 rounded-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Award className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-semibold">{tierName()} Tier</h3>
              <p className="text-sm text-muted-foreground">
                {remainingPoints > 0 
                  ? `${remainingPoints} points until ${currentTier < 5 ? tierName() + " " + (currentTier + 1) : "max tier"}`
                  : "Maximum tier reached"}
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary">{currentTier}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress to next tier</span>
            <span className="font-medium">{Math.round(progressToNextTier)}%</span>
          </div>
          <Progress 
            value={progressToNextTier} 
            className="h-2.5 transition-all duration-700"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{points} points</span>
            <span>{nextTierPoints} points</span>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-1 mt-6">
          {[1, 2, 3, 4, 5].map(tier => (
            <div 
              key={tier} 
              className={`text-center py-2 rounded-md transition-colors ${
                tier <= currentTier 
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {tier}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
