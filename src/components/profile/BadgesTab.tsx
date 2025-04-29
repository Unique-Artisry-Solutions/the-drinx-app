
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, ExternalLink } from 'lucide-react';
import RewardsStatus from './badges/RewardsStatus';
import BadgeCollection from './badges/BadgeCollection';
import { useAchievements } from '@/hooks/rewards/useAchievements';
import { motion } from 'framer-motion';

const BadgesTab: React.FC = () => {
  // Mock user stats that would normally come from API or context
  const userStats = {
    barCrawlsCompleted: 7,
    establishmentsVisited: 12,
    mocktailsTried: 15,
    reviewsWritten: 3,
    mocktailsCreated: 2,
    mocktailsTryCount: 8
  };

  const { achievements } = useAchievements();
  const completedCount = achievements?.filter(a => a.isCompleted)?.length || 0;
  const totalCount = achievements?.length || 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Your Rewards</h2>
        <Button variant="outline" asChild>
          <Link to="/rewards" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Rewards Program
            <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
          </Link>
        </Button>
      </div>
      
      <Card>
        <RewardsStatus userStats={userStats} />
      </Card>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Your Badges</h2>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{completedCount}/{totalCount}</span> earned
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <BadgeCollection userStats={userStats} />
      </Card>
    </motion.div>
  );
};

export default BadgesTab;
