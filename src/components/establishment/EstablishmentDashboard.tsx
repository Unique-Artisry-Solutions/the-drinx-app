
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, Building2 } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import QuickNavigation from './QuickNavigation';
import SectionContent from './SectionContent';
import RecentActivityCard from './RecentActivityCard';
import PendingActionsCard from './PendingActionsCard';
import MocktailSuggestionsCard from './MocktailSuggestionsCard';
import AnalyticsSection from './sections/AnalyticsSection';
import { useVisitorStats } from '@/hooks/establishment/useVisitorStats';

interface EstablishmentDashboardProps {
  establishmentName: string;
  establishmentId: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({
  establishmentName,
  establishmentId
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const visitorStats = useVisitorStats(establishmentId);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActiveSection(null);
  };

  const handleQuickLinkClick = (section: string) => {
    setActiveSection(section);
  };

  const handleAddMocktail = () => {
    // Add mocktail functionality
    console.log('Add mocktail clicked');
  };

  // Mock data for components that need it
  const mockActivities = [
    {
      id: 1,
      type: 'review' as const,
      user: 'John Doe',
      content: 'Left a 5-star review',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'visit' as const,
      user: 'Jane Smith',
      content: 'Checked in',
      time: '4 hours ago'
    }
  ];

  if (activeSection) {
    return (
      <div className="space-y-6">
        <DashboardHeader 
          establishmentName={establishmentName}
          onAddMocktail={handleAddMocktail}
        />
        <QuickNavigation
          activeSection={activeSection}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          handleQuickLinkClick={handleQuickLinkClick}
          establishmentId={establishmentId}
        />
        <SectionContent
          activeSection={activeSection}
          handleTabChange={handleTabChange}
          visitorStats={visitorStats}
          establishmentId={establishmentId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        establishmentName={establishmentName}
        onAddMocktail={handleAddMocktail}
      />

      <QuickNavigation
        activeSection={activeSection}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        handleQuickLinkClick={handleQuickLinkClick}
        establishmentId={establishmentId}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-4 md:mx-6 lg:mx-[10%]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorStats.totalVisits || 0}</div>
            <p className="text-xs text-muted-foreground">+10.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">3 this hour</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7-9 PM</div>
            <p className="text-xs text-muted-foreground">Busiest time today</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Dashboard Section - Restored */}
      <AnalyticsSection 
        visitorStats={visitorStats}
        establishmentId={establishmentId}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-4 md:mx-6 lg:mx-[10%]">
        <div className="lg:col-span-2">
          <RecentActivityCard activities={mockActivities} />
        </div>
        
        <div className="space-y-6">
          <PendingActionsCard 
            pendingBarCrawls={3}
            pendingReviews={2}
          />
          <MocktailSuggestionsCard 
            pendingSuggestionCount={5}
          />
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDashboard;
