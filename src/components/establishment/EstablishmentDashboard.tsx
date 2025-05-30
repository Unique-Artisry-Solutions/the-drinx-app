import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendingActionsCard from './PendingActionsCard';
import MocktailSuggestionsCard from './MocktailSuggestionsCard';
import RecentActivityCard from './RecentActivityCard';
import SectionContent from './SectionContent';
import VisitorStatsTab from './VisitorStatsTab';
import DrinkPopularityTab from './DrinkPopularityTab';
import { useVisitorStats } from '@/hooks/establishment/useVisitorStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Calendar, TrendingUp } from 'lucide-react';

interface EstablishmentDashboardProps {
  establishmentName?: string;
  establishmentId?: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({ 
  establishmentName = "Your Establishment",
  establishmentId 
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { visitorStats } = useVisitorStats(establishmentId || '');

  // Mock data for pending actions and suggestions
  const [pendingBarCrawls, setPendingBarCrawls] = useState(3);
  const [pendingReviews, setPendingReviews] = useState(15);
  const [pendingSuggestionCount, setPendingSuggestionCount] = useState(7);

  const handleTabChange = (tab: string) => {
    setActiveSection(tab);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{establishmentName} Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your establishment and track performance</p>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+10.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics Tabs Section - Moved above Pending Actions */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="popular-drinks">Popular Drinks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VisitorStatsTab 
                visitorStats={visitorStats}
                hasData={visitorStats.hasData}
              />
              <DrinkPopularityTab hasData={false} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>
                <p className="text-gray-500">Revenue analytics coming soon...</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Customer Satisfaction</h3>
                <p className="text-gray-500">Customer feedback metrics coming soon...</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="visitors" className="mt-6">
            <VisitorStatsTab 
              visitorStats={visitorStats}
              hasData={visitorStats.hasData}
            />
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-6">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">Revenue Analytics</h3>
              <p className="text-gray-500">Detailed revenue tracking and analytics coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="popular-drinks" className="mt-6">
            <DrinkPopularityTab hasData={false} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Pending Actions Card */}
      <div className="mb-6">
        <PendingActionsCard 
          pendingBarCrawls={pendingBarCrawls}
          pendingReviews={pendingReviews}
        />
      </div>
      
      {/* Mocktail Suggestions Card */}
      <div className="mb-6">
        <MocktailSuggestionsCard 
          pendingSuggestionCount={pendingSuggestionCount}
        />
      </div>

      {/* Recent Activity Card */}
      <div className="mb-8">
        <RecentActivityCard />
      </div>

      {/* Section Content */}
      {activeSection && (
        <SectionContent 
          activeSection={activeSection}
          handleTabChange={handleTabChange}
          visitorStats={visitorStats}
          establishmentId={establishmentId}
        />
      )}
    </div>
  );
};

export default EstablishmentDashboard;
