
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Star, TrendingUp, Award, Target } from 'lucide-react';
import { useUserVisits } from '@/hooks/useUserVisits';
import { Visit } from '@/types/VisitTypes';

const VisitedTab: React.FC = () => {
  const { visits, stats, isLoading } = useUserVisits();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              All time check-ins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Places</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueEstablishments}</div>
            <p className="text-xs text-muted-foreground">
              Different establishments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mocktails Tried</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_mocktails_tried || 0}</div>
            <p className="text-xs text-muted-foreground">
              Different mocktails
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No visits yet</h3>
              <p className="text-muted-foreground mb-4">
                Start exploring establishments to see your visit history here
              </p>
              <Button>
                Explore Nearby
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((visit) => (
                <VisitItem key={visit.id} visit={visit} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.totalVisits >= 1 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">First Visit</h4>
                  <p className="text-sm text-green-700">Completed your first check-in</p>
                </div>
              </div>
            )}
            
            {stats.uniqueEstablishments >= 3 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Explorer</h4>
                  <p className="text-sm text-blue-700">Visited 3+ different places</p>
                </div>
              </div>
            )}
            
            {stats.totalVisits >= 10 && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <div>
                  <h4 className="font-medium text-purple-900">Regular</h4>
                  <p className="text-sm text-purple-700">Completed 10+ check-ins</p>
                </div>
              </div>
            )}
            
            {stats.averageRating >= 4.5 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-900">High Standards</h4>
                  <p className="text-sm text-yellow-700">Average rating above 4.5</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Visit Item Component
interface VisitItemProps {
  visit: Visit;
}

const VisitItem: React.FC<VisitItemProps> = ({ visit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
          <MapPin className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-slate-900">
              {visit.establishment?.name || 'Unknown Establishment'}
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              {visit.establishment?.address || 'Address not available'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {visit.rating && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                {visit.rating}
              </Badge>
            )}
            <span className="text-sm text-slate-500">
              {formatDate(visit.visited_at)}
            </span>
          </div>
        </div>
        
        {visit.notes && (
          <p className="text-sm text-slate-600 mt-2">
            {visit.notes}
          </p>
        )}
        
        {visit.tried_mocktails.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {visit.tried_mocktails.map((mocktail, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {mocktail.notes || `Mocktail ${index + 1}`}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitedTab;
