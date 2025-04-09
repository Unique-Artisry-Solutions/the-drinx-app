
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AnalyticsSectionProps {
  visitorStats: {
    totalVisits: number;
    uniqueVisitors: number;
    returningVisitors: number;
    hasData: boolean;
    isLoading: boolean;
    error: string | null;
  };
  establishmentId?: string;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ visitorStats, establishmentId }) => {
  const navigate = useNavigate();

  const goToAnalyticsPage = () => {
    // If we have an establishment ID, include it in the URL
    if (establishmentId) {
      navigate(`/establishment/analytics/${establishmentId}`);
    } else {
      navigate('/establishment/analytics');
    }
  };
  
  if (visitorStats.isLoading) {
    return (
      <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
        <CardContent className="py-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          
          <div className="mt-6 space-y-6">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (visitorStats.error) {
    return (
      <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{visitorStats.error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!visitorStats.hasData) {
    return (
      <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              There is currently no analytics data available for this establishment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
      <CardContent className="py-6">
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
        <p>Visitor statistics and performance metrics.</p>
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Visitor Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4" style={{ backgroundColor: 'var(--theme-primary, #FF719A)', color: 'white' }}>
                <h3 className="font-medium">Total Visits</h3>
                <p className="text-2xl font-bold">{visitorStats.totalVisits}</p>
              </Card>
              <Card className="p-4" style={{ backgroundColor: 'var(--theme-secondary, #84BF04)', color: 'white' }}>
                <h3 className="font-medium">Unique Visitors</h3>
                <p className="text-2xl font-bold">{visitorStats.uniqueVisitors}</p>
              </Card>
              <Card className="p-4" style={{ backgroundColor: 'var(--theme-accent, #F29F05)', color: 'white' }}>
                <h3 className="font-medium">Returning Visitors</h3>
                <p className="text-2xl font-bold">{visitorStats.returningVisitors}</p>
              </Card>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">Visitor trend chart would display here</p>
          </div>
          <div className="flex justify-center">
            <Button onClick={goToAnalyticsPage} className="mt-4">
              View Full Analytics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
