
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Gift } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface RewardsStatusProps {
  userStats: {
    barCrawlsCompleted: number;
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
    if (userStats.barCrawlsCompleted >= 15) return 3;
    if (userStats.barCrawlsCompleted >= 5) return 2;
    return 1;
  };
  
  const currentTier = getTier();
  
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-spiritless-pink" />
          Your Reward Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Current Tier</span>
            <span>
              {currentTier === 1 && "Badge Collector"}
              {currentTier === 2 && "Rewards Club"}
              {currentTier === 3 && "VIP Experience"}
            </span>
          </div>
          <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
              style={{ width: `${Math.min((userStats.barCrawlsCompleted / 15) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-1">
            <span className="text-xs">Tier 1</span>
            <span className="text-xs">Tier 2</span>
            <span className="text-xs">Tier 3</span>
          </div>
        </div>
        
        <div className={`grid gap-2 text-sm ${isDark ? 'text-gray-300' : ''}`}>
          <div className={`flex justify-between py-1 ${isDark ? 'border-gray-700' : 'border-b'}`}>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Swig Circuits Completed</span>
            <span className="font-medium">{userStats.barCrawlsCompleted}</span>
          </div>
          <div className={`flex justify-between py-1 ${isDark ? 'border-gray-700' : 'border-b'}`}>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Establishments Visited</span>
            <span className="font-medium">{userStats.establishmentsVisited}</span>
          </div>
          <div className={`flex justify-between py-1 ${isDark ? 'border-gray-700' : 'border-b'}`}>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Mocktails Tried</span>
            <span className="font-medium">{userStats.mocktailsTried}</span>
          </div>
          <div className={`flex justify-between py-1 ${isDark ? 'border-gray-700' : 'border-b'}`}>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Reviews Written</span>
            <span className="font-medium">{userStats.reviewsWritten}</span>
          </div>
          <div className={`flex justify-between py-1 ${isDark ? 'border-gray-700' : 'border-b'}`}>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Mocktails Created</span>
            <span className="font-medium">{userStats.mocktailsCreated}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Mocktail Tester Tally</span>
            <span className="font-medium">{userStats.mocktailsTryCount}</span>
          </div>
        </div>
        
        {currentTier >= 2 && (
          <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <h3 className="font-medium flex items-center mb-1">
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
                  {userStats.mocktailsTryCount >= 10 && (
                    <li className={isDark ? "text-gray-400" : "text-gray-700"}>• Recipe Spotlight Feature</li>
                  )}
                </>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </>
  );
};

export default RewardsStatus;
