
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, TrendingUp, Star, BarChart3, DollarSign, Trophy } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import PendingActionsCard from './PendingActionsCard';
import MocktailSuggestionsCard from './MocktailSuggestionsCard';
import RecentActivityCard from './RecentActivityCard';
import SectionContent from './SectionContent';
import { useVisitorStats } from '@/hooks/establishment/useVisitorStats';
import { useActivitiesData } from '@/hooks/useActivitiesData';

interface EstablishmentDashboardProps {
  establishmentName: string;
  establishmentId?: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({ 
  establishmentName, 
  establishmentId 
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const visitorStats = useVisitorStats(establishmentId || '');
  const { activities } = useActivitiesData();

  const handleTabChange = (tab: string) => {
    setActiveSection(tab);
  };

  if (activeSection) {
    return (
      <SectionContent 
        activeSection={activeSection} 
        handleTabChange={handleTabChange}
        visitorStats={visitorStats}
        establishmentId={establishmentId}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader establishmentName={establishmentName} />
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="vibrant-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorStats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              {visitorStats.hasData ? 'Yesterday' : 'Sample data'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="vibrant-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorStats.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">
              {visitorStats.hasData ? 'Yesterday' : 'Sample data'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="vibrant-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returning Visitors</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorStats.returningVisitors}</div>
            <p className="text-xs text-muted-foreground">
              {visitorStats.hasData ? 'Yesterday' : 'Sample data'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="vibrant-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs Section - Moved above Pending Actions */}
      <Card className="vibrant-card mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
          <CardDescription>Track your establishment's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="visitors">Visitors</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="drinks">Popular Drinks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Daily Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87</div>
                    <p className="text-xs text-muted-foreground">visitors per day</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Peak Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7-9 PM</div>
                    <p className="text-xs text-muted-foreground">busiest time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Customer Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-muted-foreground">positive reviews</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="visitors" className="space-y-4">
              <div className="h-[300px] flex items-center justify-center border rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Visitor Analytics</p>
                  <p className="text-sm text-muted-foreground">Detailed visitor data visualization</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="revenue" className="space-y-4">
              <div className="h-[300px] flex items-center justify-center border rounded-lg">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Revenue Analytics</p>
                  <p className="text-sm text-muted-foreground">Revenue trends and insights</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="drinks" className="space-y-4">
              <div className="h-[300px] flex items-center justify-center border rounded-lg">
                <div className="text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Popular Drinks</p>
                  <p className="text-sm text-muted-foreground">Most ordered mocktails and beverages</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pending Actions Card */}
      <div className="mb-6">
        <PendingActionsCard handleTabChange={handleTabChange} />
      </div>

      {/* Mocktail Suggestions Card */}
      <div className="mb-6">
        <MocktailSuggestionsCard handleTabChange={handleTabChange} />
      </div>

      {/* Recent Activity Card */}
      <RecentActivityCard activities={activities} />
    </div>
  );
};

export default EstablishmentDashboard;
