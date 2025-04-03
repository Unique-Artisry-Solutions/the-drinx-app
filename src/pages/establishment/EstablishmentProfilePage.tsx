
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from '@/components/establishment/ProfileTab';
import PromotionsTab from '@/components/establishment/PromotionsTab';
import MocktailMenuTab from '@/components/establishment/MocktailMenuTab';
import VisitorStatsTab from '@/components/establishment/VisitorStatsTab';
import BarCrawlsTab from '@/components/establishment/BarCrawlsTab';
import { useEstablishmentProfile } from '@/hooks/useEstablishmentProfile';
import { useSearchParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const EstablishmentProfilePage = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('profile');
  const isMobile = useIsMobile();
  
  const {
    profileState,
    promotionsState,
    drinksState,
    visitorStats,
    barCrawlsState
  } = useEstablishmentProfile();
  
  // Set the active tab based on URL parameter if it exists
  useEffect(() => {
    if (tabParam && ['profile', 'promotions', 'menu', 'visitors', 'barCrawls'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  return (
    <Layout>
      <div className="py-4 animate-fade-in w-full">
        <div className={`flex items-center justify-between mb-6 ${isMobile ? 'px-4' : 'mx-[10%]'}`}>
          <div>
            <h1 className="text-2xl font-medium text-material-on-background">Establishment Profile</h1>
            <p className="text-material-on-surface-variant">
              Manage your establishment information and offerings
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className={isMobile ? 'px-0' : 'mx-[10%]'}>
          <div className="overflow-x-auto px-4">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
              <TabsTrigger value="menu">Mocktail Menu</TabsTrigger>
              <TabsTrigger value="visitors">Visitor Stats</TabsTrigger>
              <TabsTrigger value="barCrawls">Bar Crawl Requests</TabsTrigger>
            </TabsList>
          </div>

          <div className="px-4">
            <TabsContent value="profile">
              <ProfileTab 
                name={profileState.name} 
                email={profileState.email} 
                description={profileState.description} 
                address={profileState.address} 
                phone={profileState.phone} 
                website={profileState.website} 
                isLoading={profileState.isLoading} 
                setName={profileState.setName} 
                setEmail={profileState.setEmail} 
                setDescription={profileState.setDescription} 
                setAddress={profileState.setAddress} 
                setPhone={profileState.setPhone} 
                setWebsite={profileState.setWebsite} 
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
