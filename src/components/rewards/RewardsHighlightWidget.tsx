
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Gift, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useRewards } from '@/hooks/rewards/useRewards';
import { formatPoints } from '@/lib/pointsFormatter';

/**
 * A prominent widget to display user rewards on the home/explore page
 * Designed to increase visibility and engagement with the rewards program
 */
export const RewardsHighlightWidget = () => {
  const { rewardProfile, isLoading } = useRewards();
  
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-purple-100 dark:border-purple-900 shadow-sm">
        <CardContent className="p-4">
          <div className="h-20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!rewardProfile) {
    return null;
  }
  
  const pointsValue = formatPoints(rewardProfile.points);
  const hasRewards = rewardProfile.availableRewards && rewardProfile.availableRewards.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-purple-100 dark:border-purple-900">
        <CardContent className="p-4 pt-5">
          <div className="flex items-center gap-3 mb-3">
            <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-medium">My Rewards</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-500 dark:text-gray-400">Available Points</span>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{pointsValue}</span>
                <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-500 dark:text-gray-400">Available Rewards</span>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {rewardProfile.availableRewards?.length || 0}
                </span>
                <Gift className="h-4 w-4 text-amber-500 mb-1" />
              </div>
            </div>
          </div>
          
          {hasRewards && (
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-md p-2 text-center mt-2 text-sm">
              You have rewards ready to redeem!
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-white/50 dark:bg-white/5 p-3 flex justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/rewards" className="text-indigo-600 dark:text-indigo-400">View Dashboard</Link>
          </Button>
          {hasRewards && (
            <Button asChild variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Link to="/rewards?tab=redeem">Redeem Rewards</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RewardsHighlightWidget;
