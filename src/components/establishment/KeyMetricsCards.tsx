
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar, Star, TrendingUp, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KeyMetricsCardsProps {
  stats: {
    totalVisits: number;
    newVisitorsToday: number;
    returningRate: number;
    avgRating: number;
    reviewsThisWeek: number;
    topMocktail: string;
    topMocktailOrders: number;
  };
}

const KeyMetricsCards: React.FC<KeyMetricsCardsProps> = ({ stats }) => {
  const navigate = useNavigate();

  // Function to navigate to the mocktail details page
  const navigateToTopMocktail = () => {
    navigate('/establishment/mocktail/1'); // Using a hardcoded ID for the top mocktail
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="vibrant-card border-spiritless-pink/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <UserCheck className="mr-2 h-4 w-4 text-spiritless-pink" />
            Total Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVisits}</div>
          <p className="text-xs text-material-on-surface-variant mt-1">
            +{stats.newVisitorsToday} today
          </p>
        </CardContent>
      </Card>
      
      <Card className="vibrant-card border-spiritless-green/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="mr-2 h-4 w-4 text-spiritless-green" />
            Return Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.returningRate}%</div>
          <p className="text-xs text-material-on-surface-variant mt-1">
            of visitors return
          </p>
        </CardContent>
      </Card>
      
      <Card className="vibrant-card border-spiritless-orange/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Star className="mr-2 h-4 w-4 text-spiritless-orange" />
            Average Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgRating}</div>
          <p className="text-xs text-material-on-surface-variant mt-1">
            {stats.reviewsThisWeek} new reviews this week
          </p>
        </CardContent>
      </Card>
      
      <Card className="vibrant-card border-blue-400/20 cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToTopMocktail}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <BarChart className="mr-2 h-4 w-4 text-blue-400" />
            Top Mocktail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">{stats.topMocktail}</div>
          <p className="text-xs text-material-on-surface-variant mt-1">
            {stats.topMocktailOrders} orders this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetricsCards;
