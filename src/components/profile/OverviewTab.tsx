
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GlassWater, MapPin, Route, Star, User, Award, Badge, Trophy, GiftIcon, ChevronRight, Map, Wine, ThumbsUp } from 'lucide-react';
import CreateMocktailButton from '@/components/mocktail/CreateMocktailButton';
import { useTheme } from '@/contexts/ThemeContext';

interface OverviewTabProps {
  userName: string;
  userEmail: string;
  userJoinDate: Date | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ userName, userEmail, userJoinDate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Get reward stats from localStorage if available (default values if not)
  const getUserStats = () => {
    const storedStats = localStorage.getItem('user_rewards_stats');
    if (storedStats) {
      return JSON.parse(storedStats);
    }
    return {
      barCrawlsCompleted: 7,
      establishmentsVisited: 12,
      mocktailsTried: 15,
      reviewsWritten: 3,
      mocktailsCreated: 2,
      mocktailsTryCount: 8
    };
  };
  
  const userStats = getUserStats();
  const getTier = () => {
    if (userStats.barCrawlsCompleted >= 15) return 3;
    if (userStats.barCrawlsCompleted >= 5) return 2;
    return 1;
  };
  
  const currentTier = getTier();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`hover:shadow-md transition-shadow ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-800/80' : ''}`}>
          <CardHeader>
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'}`}>Name</div>
                <div className="font-medium">{userName}</div>
              </div>
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'}`}>Email</div>
                <div className="font-medium">{userEmail}</div>
              </div>
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'}`}>Member Since</div>
                <div className="font-medium">{userJoinDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/profile/settings">
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-md transition-shadow ${isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-purple-50'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Your Mocktail Journey</CardTitle>
              <CardDescription>Track your spiritless adventure</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className={`${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'} flex items-center`}>
                  <GlassWater size={16} className="mr-2" />
                  Mocktails Tried
                </span>
                <span className="font-medium">{userStats.mocktailsTried}/50</span>
              </div>
              <Progress value={(userStats.mocktailsTried / 50) * 100} className={`h-2 ${isDark ? 'bg-gray-700' : ''}`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className={`${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'} flex items-center`}>
                  <Wine size={16} className="mr-2" />
                  Mocktails Created
                </span>
                <span className="font-medium">{userStats.mocktailsCreated}/10</span>
              </div>
              <Progress value={(userStats.mocktailsCreated / 10) * 100} className={`h-2 ${isDark ? 'bg-gray-700' : ''}`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className={`${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'} flex items-center`}>
                  <ThumbsUp size={16} className="mr-2" />
                  Mocktail Tester Tally
                </span>
                <span className="font-medium">{userStats.mocktailsTryCount}/20</span>
              </div>
              <Progress value={(userStats.mocktailsTryCount / 20) * 100} className={`h-2 ${isDark ? 'bg-gray-700' : ''}`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className={`${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'} flex items-center`}>
                  <MapPin size={16} className="mr-2" />
                  Places Visited
                </span>
                <span className="font-medium">{userStats.establishmentsVisited}/25</span>
              </div>
              <Progress value={(userStats.establishmentsVisited / 25) * 100} className={`h-2 ${isDark ? 'bg-gray-700' : ''}`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className={`${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'} flex items-center`}>
                  <Route size={16} className="mr-2" />
                  Swig Circuits
                </span>
                <span className="font-medium">{userStats.barCrawlsCompleted}/15</span>
              </div>
              <Progress value={(userStats.barCrawlsCompleted / 15) * 100} className={`h-2 ${isDark ? 'bg-gray-700' : ''}`} />
            </div>
            
            <div className="flex justify-between gap-4 pt-4">
              <Button className="flex-1 bg-spiritless-pink hover:bg-spiritless-pink/90" asChild>
                <Link to="/map">
                  <Map size={20} />
                </Link>
              </Button>
              <CreateMocktailButton />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`hover:shadow-md transition-shadow ${isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:bg-gray-800/80' 
          : 'bg-gradient-to-br from-white to-purple-50/50'}`}
        >
          <Link to="/profile/bar-crawls" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-3 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                <Route size={24} className={isDark ? 'text-purple-300' : 'text-purple-600'} />
              </div>
              <h3 className="font-medium mb-1">Joined Bar Crawls</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'}`}>
                View bar crawls you've participated in
              </p>
            </div>
          </Link>
        </Card>
        
        <Card className={`hover:shadow-md transition-shadow ${isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:bg-gray-800/80' 
          : 'bg-gradient-to-br from-white to-blue-50/50'}`}
        >
          <Link to="/profile/my-creations" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-3 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                <User size={24} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
              </div>
              <h3 className="font-medium mb-1">Created Bar Crawls</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'}`}>
                Manage your own bar crawls
              </p>
            </div>
          </Link>
        </Card>
        
        <Card className={`hover:shadow-md transition-shadow ${isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:bg-gray-800/80' 
          : 'bg-gradient-to-br from-white to-amber-50/50'}`}
        >
          <Link to="/profile/rewards" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-3 ${isDark ? 'bg-amber-900/50' : 'bg-amber-100'}`}>
                <Award size={24} className={isDark ? 'text-amber-300' : 'text-amber-600'} />
              </div>
              <h3 className="font-medium mb-1">Rewards & Badges</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'}`}>
                View your rewards and badges
              </p>
            </div>
          </Link>
        </Card>
        
        <Card className={`hover:shadow-md transition-shadow ${isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:bg-gray-800/80' 
          : 'bg-gradient-to-br from-white to-emerald-50/50'}`}
        >
          <Link to="/profile/favorites" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-3 ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                <Star size={24} className={isDark ? 'text-emerald-300' : 'text-emerald-600'} />
              </div>
              <h3 className="font-medium mb-1">Favorites</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-material-on-surface-variant'}`}>
                Your favorite mocktails and places
              </p>
            </div>
          </Link>
        </Card>
      </div>
      
      {/* Display recent badges */}
      {(currentTier >= 2) && (
        <Card className={`${isDark 
          ? 'bg-gradient-to-r from-amber-900/20 to-pink-900/20 dark:from-gray-800 dark:to-gray-900 border-l-4 border-amber-700' 
          : 'bg-gradient-to-r from-amber-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-amber-400'}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge className="h-5 w-5 mr-2 text-spiritless-pink" />
              Your Reward Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center justify-between p-4 rounded-lg ${isDark 
              ? 'bg-gray-800/70 backdrop-blur-sm' 
              : 'bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm'}`}
            >
              <div>
                <h3 className="font-medium flex items-center">
                  {currentTier === 2 && (
                    <>
                      <GiftIcon className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      Tier 2: Rewards Club Member
                    </>
                  )}
                  {currentTier === 3 && (
                    <>
                      <Trophy className={`h-5 w-5 mr-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                      Tier 3: VIP Experience Member
                    </>
                  )}
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentTier === 2 && "You've unlocked special discounts and offers!"}
                  {currentTier === 3 && "You've unlocked exclusive VIP experiences and benefits!"}
                </p>
              </div>
              <Button asChild variant="gradient" size="icon">
                <Link to="/profile/rewards" aria-label="View Benefits">
                  <ChevronRight />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;
