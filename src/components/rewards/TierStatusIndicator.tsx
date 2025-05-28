
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';
import { ParticleEffect } from '@/components/animations/ParticleEffect';

interface TierStatusIndicatorProps {
  currentTier: number;
  points: number;
}

export function TierStatusIndicator({ currentTier, points }: TierStatusIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const isMobile = useIsMobile();
  
  // Determine points needed for next tier
  const pointsForNextTier = currentTier * 1000;
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

  const handleTierClick = () => {
    setShowParticles(true);
  };

  const TierContent = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div onClick={handleTierClick} className="cursor-pointer hover:scale-110 transition-transform">
          <div className="text-2xl font-bold text-orange-600 animate-pulse">{currentTier}</div>
          <div className="text-sm text-muted-foreground">Current Tier</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-orange-500">{tierName()}</div>
          <div className="text-sm text-muted-foreground">
            {remainingPoints > 0 
              ? `${remainingPoints} to go`
              : "Max tier"}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Progress to next tier</span>
          <span className="font-medium">{Math.round(progressToNextTier)}%</span>
        </div>
        <AnimatedProgressBar 
          value={progressToNextTier} 
          max={100}
          className={`transition-all duration-700 ${isMobile ? 'h-3' : 'h-2.5'}`}
          showGlow={progressToNextTier > 70}
          color={progressToNextTier > 80 ? 'success' : 'warning'}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{points} points</span>
          <span>{nextTierPoints} points</span>
        </div>
      </div>
      
      <div className={`grid gap-1 mt-6 ${isMobile ? 'grid-cols-3' : 'grid-cols-5'}`}>
        {[1, 2, 3, 4, 5].map(tier => (
          <motion.div 
            key={tier} 
            className={`text-center py-2 rounded-md transition-all duration-300 text-xs sm:text-sm ${isMobile ? 'min-h-[40px]' : 'min-h-[36px]'} ${
              tier <= currentTier 
                ? 'bg-primary/20 text-primary font-medium animate-pulse' 
                : 'bg-muted text-muted-foreground'
            } ${isMobile && tier > 3 ? 'hidden' : ''}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: tier * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {tier}
          </motion.div>
        ))}
        {isMobile && (
          <div className="text-center py-2 rounded-md bg-muted/50 text-muted-foreground text-xs min-h-[40px] flex items-center justify-center">
            +2
          </div>
        )}
      </div>

      <ParticleEffect 
        trigger={showParticles} 
        points={currentTier * 100}
        onComplete={() => setShowParticles(false)}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Card className="overflow-hidden shadow-md border-t-4 border-t-primary">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors min-h-[64px] flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <motion.div 
                  className="p-2 bg-primary/10 rounded-full"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Award className="h-5 w-5 text-primary animate-pulse" />
                </motion.div>
                {tierName()} Tier
              </CardTitle>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <TierContent />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

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
              whileHover={{ scale: 1.1 }}
            >
              <Award className="h-6 w-6 text-primary animate-pulse" />
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
          <span className="text-2xl font-bold text-primary animate-pulse">{currentTier}</span>
        </div>
        
        <TierContent />
      </CardContent>
    </Card>
  );
}
