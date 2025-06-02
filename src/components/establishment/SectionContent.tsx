
import React from 'react';
import AllActionsSection from './sections/AllActionsSection';
import AnalyticsSection from './sections/AnalyticsSection';
import SettingsSection from './sections/SettingsSection';

interface SectionContentProps {
  activeSection: string | null;
  handleTabChange: (tab: string) => void;
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

const SectionContent: React.FC<SectionContentProps> = ({ 
  activeSection, 
  handleTabChange,
  visitorStats,
  establishmentId
}) => {
  if (!activeSection) return null;
  
  switch (activeSection) {
    case 'allActions':
      return <AllActionsSection handleTabChange={handleTabChange} />;
    case 'analytics':
      return <AnalyticsSection 
        visitorStats={visitorStats}
        establishmentId={establishmentId || ''} 
      />;
    case 'settings':
      return <SettingsSection handleTabChange={handleTabChange} />;
    default:
      return null;
  }
};

export default SectionContent;
