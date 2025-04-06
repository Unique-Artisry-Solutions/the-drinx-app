
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeIcon, Route, MapPin, GlassWater, Star, Sparkles, Trophy, Wine, ThumbsUp } from 'lucide-react';
import BadgeItem from './BadgeItem';
import { useTheme } from '@/contexts/ThemeContext';

interface BadgeCollectionProps {
  userStats: {
    barCrawlsCompleted: number;
    establishmentsVisited: number;
    mocktailsTried: number;
    reviewsWritten: number;
    mocktailsCreated: number;
    mocktailsTryCount: number;
  };
}

const BadgeCollection: React.FC<BadgeCollectionProps> = ({ userStats }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeIcon className="h-5 w-5 text-spiritless-pink" />
          Your Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <BadgeItem
            icon={<Route className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
            name="First Crawl"
            description="Complete your first swig circuit"
            unlocked={userStats.barCrawlsCompleted >= 1}
          />
          <BadgeItem
            icon={<MapPin className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />}
            name="Explorer"
            description="Visit 5 different establishments"
            unlocked={userStats.establishmentsVisited >= 5}
            progress={Math.min(userStats.establishmentsVisited, 5)}
            maxProgress={5}
          />
          <BadgeItem
            icon={<GlassWater className={`h-5 w-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />}
            name="Mocktail Maven"
            description="Try 10 different mocktails"
            unlocked={userStats.mocktailsTried >= 10}
            progress={Math.min(userStats.mocktailsTried, 10)}
            maxProgress={10}
          />
          <BadgeItem
            icon={<Star className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
            name="Review Star"
            description="Write 3 establishment reviews"
            unlocked={userStats.reviewsWritten >= 3}
            progress={userStats.reviewsWritten}
            maxProgress={3}
          />
          <BadgeItem
            icon={<Sparkles className={`h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />}
            name="Crawl Enthusiast"
            description="Complete 5 swig circuits"
            unlocked={userStats.barCrawlsCompleted >= 5}
            progress={Math.min(userStats.barCrawlsCompleted, 5)}
            maxProgress={5}
          />
          <BadgeItem
            icon={<Trophy className={`h-5 w-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />}
            name="VIP Crawler"
            description="Complete 15 swig circuits"
            unlocked={userStats.barCrawlsCompleted >= 15}
            progress={Math.min(userStats.barCrawlsCompleted, 15)}
            maxProgress={15}
          />
          <BadgeItem
            icon={<Wine className={`h-5 w-5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />}
            name="Mocktail Creator"
            description="Create your first mocktail recipe"
            unlocked={userStats.mocktailsCreated >= 1}
            progress={Math.min(userStats.mocktailsCreated, 1)}
            maxProgress={1}
          />
          <BadgeItem
            icon={<ThumbsUp className={`h-5 w-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />}
            name="Social Butterfly"
            description="Have 5 users try your mocktails"
            unlocked={userStats.mocktailsTryCount >= 5}
            progress={Math.min(userStats.mocktailsTryCount, 5)}
            maxProgress={5}
          />
        </div>
      </CardContent>
    </>
  );
};

export default BadgeCollection;
