import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Star, Gift, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';
import { ParticleEffect } from '@/components/animations/ParticleEffect';
const RewardsHighlightWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const isMobile = useIsMobile();

  // Mock data
  const totalPoints = 1250;
  const nextTierPoints = 1500;
  const currentTier = "Silver";
  const nextTier = "Gold";
  const progressToNextTier = totalPoints / nextTierPoints * 100;
  const recentRewards = [{
    id: 1,
    name: "Check-in Bonus",
    points: 10,
    type: "daily"
  }, {
    id: 2,
    name: "Review Reward",
    points: 25,
    type: "activity"
  }, {
    id: 3,
    name: "Streak Bonus",
    points: 50,
    type: "milestone"
  }];
  const handlePointsClick = () => {
    setShowParticles(true);
  };
  const RewardsContent = () => <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`text-center p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-all duration-200 hover:scale-105 ${isMobile ? 'min-h-[80px]' : ''}`} onClick={handlePointsClick}>
          <div className="text-2xl sm:text-3xl font-bold text-primary animate-pulse">{totalPoints}</div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </div>
        <div className={`text-center p-4 bg-muted/50 rounded-lg ${isMobile ? 'min-h-[80px]' : ''}`}>
          <div className="text-lg sm:text-xl font-semibold text-amber-600">{currentTier}</div>
          <div className="text-sm text-muted-foreground">Current Tier</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm my-[41px]">
          <span>Progress to {nextTier}</span>
          <span className="font-medium">{Math.round(progressToNextTier)}%</span>
        </div>
        <AnimatedProgressBar value={progressToNextTier} max={100} className={`${isMobile ? 'h-3' : 'h-2'}`} showGlow={progressToNextTier > 70} color={progressToNextTier > 80 ? 'success' : 'default'} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{totalPoints} points</span>
          <span>{nextTierPoints} points</span>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3 text-sm">Recent Rewards</h4>
        <div className="space-y-2">
          {recentRewards.map((reward, index) => <div key={reward.id} className={`flex items-center justify-between p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-all duration-200 ${isMobile ? 'min-h-[48px]' : ''}`} style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary animate-bounce" style={{
              animationDelay: `${index * 0.2}s`
            }} />
                <span className="text-sm font-medium">{reward.name}</span>
              </div>
              <Badge variant="outline" className="text-xs animate-fade-in">
                +{reward.points}
              </Badge>
            </div>)}
        </div>
      </div>

      <ParticleEffect trigger={showParticles} points={totalPoints} onComplete={() => setShowParticles(false)} />
    </div>;
  if (isMobile) {
    return <Card className="w-full">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors min-h-[64px] flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-primary animate-pulse" />
                Rewards ({totalPoints} pts)
              </CardTitle>
              {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <RewardsContent />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>;
  }
  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Star className="h-5 w-5 text-primary animate-pulse" />
          Your Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RewardsContent />
      </CardContent>
    </Card>;
};
export default RewardsHighlightWidget;