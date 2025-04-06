
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import RewardsStatus from './badges/RewardsStatus';
import BadgeCollection from './badges/BadgeCollection';

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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Your Rewards</h2>
        <Button variant="outline" asChild>
          <Link to="/profile/rewards">
            <Award className="mr-2 h-4 w-4" />
            Rewards Program
          </Link>
        </Button>
      </div>
      
      <Card>
        <RewardsStatus userStats={userStats} />
      </Card>
      
      <Card>
        <BadgeCollection userStats={userStats} />
      </Card>
    </div>
  );
};

export default BadgesTab;
