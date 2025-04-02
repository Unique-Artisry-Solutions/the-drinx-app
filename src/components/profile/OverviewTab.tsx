
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GlassWater, MapPin, Route, Star, User, Award, Badge, Trophy, GiftIcon } from 'lucide-react';
import CreateMocktailButton from '@/components/mocktail/CreateMocktailButton';

interface OverviewTabProps {
  userName: string;
  userEmail: string;
  userJoinDate: Date | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ userName, userEmail, userJoinDate }) => {
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
      reviewsWritten: 3
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
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-24 w-24 bg-gradient-to-br from-spiritless-pink to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-material-on-surface-variant">Name</div>
                <div className="font-medium">{userName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-material-on-surface-variant">Email</div>
                <div className="font-medium">{userEmail}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-material-on-surface-variant">Member Since</div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Mocktail Journey</CardTitle>
              <CardDescription>Track your spiritless adventure</CardDescription>
            </div>
            <CreateMocktailButton />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-material-on-surface-variant flex items-center">
                  <GlassWater size={16} className="mr-2" />
                  Mocktails Tried
                </span>
                <span className="font-medium">{userStats.mocktailsTried}/50</span>
              </div>
              <Progress value={(userStats.mocktailsTried / 50) * 100} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-material-on-surface-variant flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Places Visited
                </span>
                <span className="font-medium">{userStats.establishmentsVisited}/25</span>
              </div>
              <Progress value={(userStats.establishmentsVisited / 25) * 100} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-material-on-surface-variant flex items-center">
                  <Route size={16} className="mr-2" />
                  Bar Crawls
                </span>
                <span className="font-medium">{userStats.barCrawlsCompleted}/15</span>
              </div>
              <Progress value={(userStats.barCrawlsCompleted / 15) * 100} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-material-on-surface-variant flex items-center">
                  <Trophy size={16} className="mr-2" />
                  Reward Tier
                </span>
                <span className="font-medium">
                  {currentTier === 1 && "Tier 1: Badge Collector"}
                  {currentTier === 2 && "Tier 2: Rewards Club"}
                  {currentTier === 3 && "Tier 3: VIP Experience"}
                </span>
              </div>
              <Progress value={(currentTier / 3) * 100} className="h-2" />
            </div>
            
            <div className="pt-2">
              <Button className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90" asChild>
                <Link to="/map">
                  Explore New Places
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <Link to="/profile/bar-crawls" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 rounded-full mb-3">
                <Route size={24} className="text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Joined Bar Crawls</h3>
              <p className="text-sm text-material-on-surface-variant">
                View bar crawls you've participated in
              </p>
            </div>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <Link to="/profile/my-creations" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <User size={24} className="text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Created Bar Crawls</h3>
              <p className="text-sm text-material-on-surface-variant">
                Manage your own bar crawls
              </p>
            </div>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <Link to="/profile/rewards" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-amber-100 rounded-full mb-3">
                <Award size={24} className="text-amber-600" />
              </div>
              <h3 className="font-medium mb-1">Rewards & Badges</h3>
              <p className="text-sm text-material-on-surface-variant">
                View your rewards and badges
              </p>
            </div>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <Link to="/profile/favorites" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-emerald-100 rounded-full mb-3">
                <Star size={24} className="text-emerald-600" />
              </div>
              <h3 className="font-medium mb-1">Favorites</h3>
              <p className="text-sm text-material-on-surface-variant">
                Your favorite mocktails and places
              </p>
            </div>
          </Link>
        </Card>
      </div>
      
      {/* Display recent badges */}
      {(currentTier >= 2) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge className="h-5 w-5 mr-2 text-spiritless-pink" />
              Your Reward Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium flex items-center">
                  {currentTier === 2 && (
                    <>
                      <GiftIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Tier 2: Rewards Club Member
                    </>
                  )}
                  {currentTier === 3 && (
                    <>
                      <Trophy className="h-5 w-5 mr-2 text-amber-600" />
                      Tier 3: VIP Experience Member
                    </>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {currentTier === 2 && "You've unlocked special discounts and offers!"}
                  {currentTier === 3 && "You've unlocked exclusive VIP experiences and benefits!"}
                </p>
              </div>
              <Button asChild>
                <Link to="/profile/rewards">View Benefits</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;
