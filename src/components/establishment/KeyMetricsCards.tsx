
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart2, Users, CreditCard, Award, Star, CircleSlash } from 'lucide-react';

interface StatsData {
  revenue: string;
  reviewsThisWeek: number;
  pendingBarCrawls: number;
  totalRating: number;
  visitorCount: number;
  returningRate: number;
  // Add data availability flags
  hasRevenueData?: boolean;
  hasVisitorData?: boolean;
  hasRatingData?: boolean;
  hasReturnRateData?: boolean;
}

interface KeyMetricsCardsProps {
  stats: StatsData;
  onViewAllRatings?: () => void;
  onViewAllAnalytics?: () => void;
}

const KeyMetricsCards: React.FC<KeyMetricsCardsProps> = ({ 
  stats, 
  onViewAllRatings,
  onViewAllAnalytics
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue Card */}
      <div 
        className="cursor-pointer transform transition-transform hover:scale-105" 
        onClick={onViewAllAnalytics}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-material-on-surface-variant">Revenue</p>
                {stats.hasRevenueData !== false ? (
                  <>
                    <h3 className="text-2xl font-bold mt-1 text-material-on-background">{stats.revenue}</h3>
                    <p className="text-xs text-material-on-surface-variant mt-1">This month</p>
                  </>
                ) : (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mt-1 text-material-on-surface-variant">
                      <CircleSlash className="h-4 w-4 mr-1 text-gray-400" />
                      <p>No data available</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitors Card */}
      <div 
        className="cursor-pointer transform transition-transform hover:scale-105" 
        onClick={onViewAllAnalytics}
      >
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/40 dark:to-teal-950/40 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-material-on-surface-variant">Visitors</p>
                {stats.hasVisitorData !== false ? (
                  <>
                    <h3 className="text-2xl font-bold mt-1 text-material-on-background">{stats.visitorCount}</h3>
                    <p className="text-xs text-material-on-surface-variant mt-1">This week</p>
                  </>
                ) : (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mt-1 text-material-on-surface-variant">
                      <CircleSlash className="h-4 w-4 mr-1 text-gray-400" />
                      <p>No data available</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Card */}
      <div 
        className="cursor-pointer transform transition-transform hover:scale-105" 
        onClick={onViewAllRatings}
      >
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-material-on-surface-variant">Rating</p>
                {stats.hasRatingData !== false ? (
                  <>
                    <div className="flex items-center mt-1">
                      <h3 className="text-2xl font-bold text-material-on-background">{stats.totalRating.toFixed(1)}</h3>
                      <Star className="h-4 w-4 ml-1 text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-xs text-material-on-surface-variant mt-1">{stats.reviewsThisWeek} new reviews</p>
                  </>
                ) : (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mt-1 text-material-on-surface-variant">
                      <CircleSlash className="h-4 w-4 mr-1 text-gray-400" />
                      <p>No ratings yet</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <Award className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitors Growth Card */}
      <div 
        className="cursor-pointer transform transition-transform hover:scale-105" 
        onClick={onViewAllAnalytics}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-material-on-surface-variant">Returning Rate</p>
                {stats.hasReturnRateData !== false ? (
                  <>
                    <h3 className="text-2xl font-bold mt-1 text-material-on-background">{stats.returningRate}%</h3>
                    <p className="text-xs text-material-on-surface-variant mt-1">Vs. last month</p>
                  </>
                ) : (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mt-1 text-material-on-surface-variant">
                      <CircleSlash className="h-4 w-4 mr-1 text-gray-400" />
                      <p>Insufficient data</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <BarChart2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KeyMetricsCards;
