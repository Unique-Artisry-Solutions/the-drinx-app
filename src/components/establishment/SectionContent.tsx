
import React from 'react';
import AllActionsSection from './sections/AllActionsSection';
import AnalyticsSection from './sections/AnalyticsSection';
import SettingsSection from './sections/SettingsSection';
import EstablishmentInbox from './communication/EstablishmentInbox';

interface SectionContentProps {
  activeSection: string | null;
  handleTabChange: (tab: string) => void;
  visitorStats: {
    totalVisits: number; // Match the property name from useVisitorStats
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
        visitorStats={visitorStats} // Pass the visitor stats directly as they now match
        establishmentId={establishmentId} 
      />;
    case 'settings':
      return <SettingsSection handleTabChange={handleTabChange} />;
    case 'communication':
      return (
        <div className="space-y-4 px-4">
          <h2 className="text-xl font-semibold">Promoter Communication</h2>
          <p className="text-gray-600">
            Manage messages from promoters interested in organizing events at your venue.
          </p>
          <EstablishmentInbox />
        </div>
      );
    default:
      return null;
  }
};

export default SectionContent;
