
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Badge as BadgeIcon, Trophy, Star, Route, MapPin, GlassWater, Gift, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BadgeItemProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ 
  icon, 
  name, 
  description, 
  unlocked, 
  progress, 
  maxProgress 
}) => {
  return (
    <div className={`p-4 border rounded-lg ${unlocked ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${unlocked ? 'bg-green-100' : 'bg-gray-200'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            {unlocked && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Unlocked
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
          
          {progress !== undefined && maxProgress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progress}/{maxProgress}</span>
              </div>
              <Progress value={(progress / maxProgress) * 100} className="h-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BadgesTab: React.FC = () => {
  // This would come from user data in a real implementation
  const userStats = {
    barCrawlsCompleted: 7,
    establishmentsVisited: 12,
    mocktailsTried: 15,
    reviewsWritten: 3
  };
  
  // Calculate reward tier based on bar crawls completed
  const getTier = () => {
    if (userStats.barCrawlsCompleted >= 15) return 3;
    if (userStats.barCrawlsCompleted >= 5) return 2;
    return 1;
  };
  
  const currentTier = getTier();
  
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
      
      {/* Current Status Card */}
      <Card>
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
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
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
          
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-600">Bar Crawls Completed</span>
              <span className="font-medium">{userStats.barCrawlsCompleted}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-600">Establishments Visited</span>
              <span className="font-medium">{userStats.establishmentsVisited}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-600">Mocktails Tried</span>
              <span className="font-medium">{userStats.mocktailsTried}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Reviews Written</span>
              <span className="font-medium">{userStats.reviewsWritten}</span>
            </div>
          </div>
          
          {currentTier >= 2 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium flex items-center mb-1">
                <Gift className="h-4 w-4 mr-2 text-blue-600" />
                Active Rewards
              </h3>
              <ul className="text-sm space-y-1">
                <li className="text-gray-700">• 10% Off Signature Mocktails</li>
                <li className="text-gray-700">• Free Mocktail (every 3rd visit)</li>
                {currentTier >= 3 && (
                  <>
                    <li className="text-gray-700">• VIP Bar Crawl Access</li>
                    <li className="text-gray-700">• Exclusive Tasting Invitations</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeIcon className="h-5 w-5 text-spiritless-pink" />
            Your Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <BadgeItem
              icon={<Route className="h-5 w-5 text-purple-600" />}
              name="First Crawl"
              description="Complete your first bar crawl"
              unlocked={userStats.barCrawlsCompleted >= 1}
            />
            <BadgeItem
              icon={<MapPin className="h-5 w-5 text-emerald-600" />}
              name="Explorer"
              description="Visit 5 different establishments"
              unlocked={userStats.establishmentsVisited >= 5}
              progress={Math.min(userStats.establishmentsVisited, 5)}
              maxProgress={5}
            />
            <BadgeItem
              icon={<GlassWater className="h-5 w-5 text-amber-600" />}
              name="Mocktail Maven"
              description="Try 10 different mocktails"
              unlocked={userStats.mocktailsTried >= 10}
              progress={Math.min(userStats.mocktailsTried, 10)}
              maxProgress={10}
            />
            <BadgeItem
              icon={<Star className="h-5 w-5 text-blue-600" />}
              name="Review Star"
              description="Write 3 establishment reviews"
              unlocked={userStats.reviewsWritten >= 3}
              progress={userStats.reviewsWritten}
              maxProgress={3}
            />
            <BadgeItem
              icon={<Sparkles className="h-5 w-5 text-indigo-600" />}
              name="Crawl Enthusiast"
              description="Complete 5 bar crawls"
              unlocked={userStats.barCrawlsCompleted >= 5}
              progress={Math.min(userStats.barCrawlsCompleted, 5)}
              maxProgress={5}
            />
            <BadgeItem
              icon={<Trophy className="h-5 w-5 text-amber-600" />}
              name="VIP Crawler"
              description="Complete 15 bar crawls"
              unlocked={userStats.barCrawlsCompleted >= 15}
              progress={Math.min(userStats.barCrawlsCompleted, 15)}
              maxProgress={15}
            />
            <BadgeItem
              icon={<Award className="h-5 w-5 text-rose-600" />}
              name="Mixology Friend"
              description="Attend a mixology workshop"
              unlocked={false}
            />
            <BadgeItem
              icon={<Gift className="h-5 w-5 text-teal-600" />}
              name="Social Butterfly"
              description="Invite 3 friends to bar crawls"
              unlocked={false}
              progress={0}
              maxProgress={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgesTab;
