
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useEstablishmentProfile } from '@/hooks/establishment/useEstablishmentProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import QuickNavigation from '@/components/establishment/QuickNavigation';
import SectionContent from '@/components/establishment/SectionContent';
import TabContent from '@/components/establishment/TabContent';

const EstablishmentProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const {
    profileState,
    promotionsState,
    drinksState,
    visitorStats,
    barCrawlsState
  } = useEstablishmentProfile();
  
  useEffect(() => {
    if (tabParam && ['profile', 'promotions', 'menu', 'visitors', 'barCrawls'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setSearchParams({ tab: 'profile' });
    }
  }, [tabParam, setSearchParams]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActiveSection(null); // Reset section when changing tabs
    setSearchParams({ tab: value });
  };
  
  const tabOptions = [
    { value: 'profile', label: isMobile ? 'Profile' : 'Profile' },
    { value: 'promotions', label: isMobile ? 'Promos' : 'Promotions' },
    { value: 'menu', label: isMobile ? 'Menu' : 'Mocktail Menu' },
    { value: 'visitors', label: isMobile ? 'Stats' : 'Visitor Stats' },
    { value: 'barCrawls', label: isMobile ? 'Crawls' : 'Bar Crawl Requests' }
  ];

  // Handle quick link click
  const handleQuickLinkClick = (section: string) => {
    // First clear any active section
    setActiveSection(null);
    
    // Set this as a custom section
    setActiveSection(section);
  };
  
  return (
    <Layout 
      activeTab={activeTab} 
      handleTabChange={handleTabChange}
      tabOptions={tabOptions}
    >
      <div className="py-4 animate-fade-in w-full">
        {/* Quick Navigation Links */}
        <QuickNavigation 
          activeSection={activeSection} 
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          handleQuickLinkClick={handleQuickLinkClick}
        />
        
        {/* Show section content if a quick link is active */}
        <SectionContent 
          activeSection={activeSection} 
          handleTabChange={handleTabChange}
          visitorStats={visitorStats}
        />
        
        {/* Show tab content only if no section is active */}
        {!activeSection && (
          <TabContent 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            useIsMobile={useIsMobile}
            profileState={profileState}
            promotionsState={promotionsState}
            drinksState={drinksState}
            visitorStats={visitorStats}
            barCrawlsState={barCrawlsState}
          />
        )}
      </div>
    </Layout>
  );
};

export default EstablishmentProfilePage;
