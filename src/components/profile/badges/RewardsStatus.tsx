
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Gift } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RewardsStatusProps {
  userStats: {
    swigCircuitsCompleted: number;
    establishmentsVisited: number;
    mocktailsTried: number;
    reviewsWritten: number;
    mocktailsCreated: number;
    mocktailsTryCount: number;
  };
}

const RewardsStatus: React.FC<RewardsStatusProps> = ({ userStats }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const getTier = () => {
    if (userStats.swigCircuitsCompleted >= 15) return 3;
    if (userStats.swigCircuitsCompleted >= 5) return 2;
    return 1;
  };
  
  const currentTier = getTier();
  
  // Calculate progress percentage to next tier
  const progressPercentage = () => {
    if (currentTier === 1) {
      return (userStats.swigCircuitsCompleted / 5) * 100;
    } else if (currentTier === 2) {
      return ((userStats.swigCircuitsCompleted - 5) / 10) * 100;
    } else {
      return 100;
    }
  };
  
  // Calculate points estimate based on user stats
  const calculatePoints = () => {
    let points = 0;
    points += userStats.swigCircuitsCompleted * 100; // 100 points per bar crawl
    points += userStats.establishmentsVisited * 10; // 10 points per visit
    points += userStats.mocktailsTried * 5; // 5 points per mocktail tried
    points += userStats.reviewsWritten * 15; // 15 points per review
    points += userStats.mocktailsCreated * 50; // 50 points per mocktail created
    return points;
  };
  
  const totalPoints = calculatePoints();
  
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 relative">
          <Trophy className="h-5 w-5 text-spiritless-pink" />
          <span>Your Reward Status</span>
          <Badge variant="outline" className="ml-auto">
            {currentTier === 1 && "Bronze"}
            {currentTier === 2 && "Silver"}
            {currentTier === 3 && "Gold"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <div>
              <span className="font-medium text-lg">{totalPoints}</span>
              <span className="text-xs ml-1 text-muted-foreground">points</span>
            </div>
            <span className="text-sm font-medium">
              {currentTier === 1 && "Badge Collector"}
              {currentTier === 2 && "Rewards Club"}
              {currentTier === 3 && "VIP Experience"}
            </span>
          </div>
          <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'} relative`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage(), 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
            />
          </div>
          
          <div className="flex justify-between mt-1">
            <span className="text-xs">Tier 1</span>
            <span className="text-xs">Tier 2</span>
            <span className="text-xs">Tier 3</span>
          </div>
        </div>
        
        <div className={`grid gap-3 text-sm ${isDark ? 'text-gray-300' : ''}`}>
          <div className="flex justify-between items-center">
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className={`p-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <span>Swig Circuits Completed</span>
            </div>
            <span className="font-medium">{userStats.swigCircuitsCompleted}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className={`p-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <svg className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span>Establishments Visited</span>
            </div>
            <span className="font-medium">{userStats.establishmentsVisited}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className={`p-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <svg className="h-3.5 w-3.5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span>Mocktails Tried</span>
            </div>
            <span className="font-medium">{userStats.mocktailsTried}</span>
          </div>
        </div>
        
        {currentTier >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'} border ${isDark ? 'border-blue-800/30' : 'border-blue-100'}`}
          >
            <h3 className="font-medium flex items-center mb-2">
              <Gift className={`h-4 w-4 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              Active Rewards
            </h3>
            <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : ''}`}>
              <li className={isDark ? "text-gray-400" : "text-gray-700"}>• 10% Off Signature Mocktails</li>
              <li className={isDark ? "text-gray-400" : "text-gray-700"}>• Free Mocktail (every 3rd visit)</li>
              {userStats.mocktailsCreated >= 3 && (
                <li className={isDark ? "text-gray-400" : "text-gray-700"}>• Featured Creator Badge</li>
              )}
              {currentTier >= 3 && (
                <>
                  <li className={isDark ? "text-gray-400" : "text-gray-700"}>• VIP Bar Crawl Access</li>
                  <li className={isDark ? "text-gray-400" : "text-gray-700"}>• Exclusive Tasting Invitations</li>
                </>
              )}
            </ul>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/rewards">
                  <Gift className="h-4 w-4 mr-2" />
                  View All Rewards
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </>
  );
};

export default RewardsStatus;
