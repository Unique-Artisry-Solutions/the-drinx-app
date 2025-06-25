
import React, { useState, useEffect } from 'react';
import { useUserVisits } from '@/hooks/useUserVisits';
import { RewardTransaction } from '@/types/rewards/api';
import VisitItem from './VisitItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Award, Calendar, TrendingUp } from 'lucide-react';

const VisitedTab: React.FC = () => {
  const { getUserVisits, getUserVisitStats, isLoading } = useUserVisits();
  const [visits, setVisits] = useState<RewardTransaction[]>([]);
  const [stats, setStats] = useState({
    total_visits: 0,
    unique_establishments: 0,
    total_points_earned: 0,
    visited_entities: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [visitsData, statsData] = await Promise.all([
          getUserVisits({ limit: 20 }),
          getUserVisitStats()
        ]);
        
        setVisits(visitsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading visit data:', error);
      }
    };

    loadData();
  }, [getUserVisits, getUserVisitStats]);

  const handleViewDetails = (visit: RewardTransaction) => {
    // Handle viewing visit details - could open a modal or navigate to details page
    console.log('View visit details:', visit);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Visits</p>
                <p className="text-2xl font-bold">{stats.total_visits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Unique Places</p>
                <p className="text-2xl font-bold">{stats.unique_establishments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Points Earned</p>
                <p className="text-2xl font-bold">{stats.total_points_earned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Points</p>
                <p className="text-2xl font-bold">
                  {stats.total_visits > 0 ? Math.round(stats.total_points_earned / stats.total_visits) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No visits yet</h3>
              <p className="text-gray-500">
                Start exploring and checking in to establishments to see your visit history here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((visit) => (
                <VisitItem
                  key={visit.id}
                  visit={visit}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitedTab;
