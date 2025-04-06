import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProfileTab from '@/components/establishment/ProfileTab';
import PromotionsTab from '@/components/establishment/PromotionsTab';
import MocktailMenuTab from '@/components/establishment/MocktailMenuTab';
import VisitorStatsTab from '@/components/establishment/VisitorStatsTab';
import BarCrawlsTab from '@/components/establishment/BarCrawlsTab';
import { useEstablishmentProfile } from '@/hooks/establishment/useEstablishmentProfile';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const EstablishmentProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('profile');
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
    setSearchParams({ tab: value });
  };
  
  const tabOptions = [
    { value: 'profile', label: isMobile ? 'Profile' : 'Profile' },
    { value: 'promotions', label: isMobile ? 'Promos' : 'Promotions' },
    { value: 'menu', label: isMobile ? 'Menu' : 'Mocktail Menu' },
    { value: 'visitors', label: isMobile ? 'Stats' : 'Visitor Stats' },
    { value: 'barCrawls', label: isMobile ? 'Crawls' : 'Bar Crawl Requests' }
  ];
  
  return (
    <Layout 
      activeTab={activeTab} 
      handleTabChange={handleTabChange}
      tabOptions={tabOptions}
    >
      <div className="py-4 animate-fade-in w-full">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="px-4 py-2 md:px-6 lg:mx-[10%]">
            <TabsContent value="profile">
              <ProfileTab 
                name={profileState.name} 
                email={profileState.email} 
                description={profileState.description} 
                address={profileState.address} 
                phone={profileState.phone} 
                website={profileState.website} 
                businessHours={profileState.businessHours || []}
                isLoading={profileState.isLoading} 
                setName={profileState.setName} 
                setEmail={profileState.setEmail} 
                setDescription={profileState.setDescription} 
                setAddress={profileState.setAddress} 
                setPhone={profileState.setPhone} 
                setWebsite={profileState.setWebsite}
                setBusinessHours={profileState.setBusinessHours}
                handleSaveProfile={profileState.handleSaveProfile} 
              />
            </TabsContent>

            <TabsContent value="promotions">
              <PromotionsTab 
                promotions={promotionsState.promotions} 
                newPromoCode={promotionsState.newPromoCode} 
                newPromoDescription={promotionsState.newPromoDescription} 
                setNewPromoCode={promotionsState.setNewPromoCode} 
                setNewPromoDescription={promotionsState.setNewPromoDescription} 
                handleAddPromotion={promotionsState.handleAddPromotion} 
                handleDeletePromotion={promotionsState.handleDeletePromotion} 
              />
            </TabsContent>

            <TabsContent value="menu">
              <MocktailMenuTab 
                drinks={drinksState.drinks} 
                onAddDrink={drinksState.handleAddDrink} 
                onUpdateDrink={drinksState.handleUpdateDrink} 
                onDeleteDrink={drinksState.handleDeleteDrink} 
              />
            </TabsContent>

            <TabsContent value="visitors">
              <VisitorStatsTab visitorStats={visitorStats} />
            </TabsContent>

            <TabsContent value="barCrawls">
              <BarCrawlsTab 
                barCrawls={barCrawlsState.barCrawls} 
                handleEndParticipation={barCrawlsState.handleEndParticipation} 
                handleAcceptRequest={barCrawlsState.handleAcceptRequest} 
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EstablishmentProfilePage;
