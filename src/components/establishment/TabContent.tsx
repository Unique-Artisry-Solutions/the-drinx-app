
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProfileTab from '@/components/establishment/ProfileTab';
import PromotionsTab from '@/components/establishment/PromotionsTab';
import MocktailMenuTab from '@/components/establishment/MocktailMenuTab';
import VisitorStatsTab from '@/components/establishment/VisitorStatsTab';
import BarCrawlsTab from '@/components/establishment/BarCrawlsTab';

interface TabContentProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  useIsMobile: () => boolean;
  profileState: any;
  promotionsState: any;
  drinksState: any;
  visitorStats: {
    totalVisits: number;
    uniqueVisitors: number;
    returningVisitors: number;
    hasData: boolean;
    isLoading: boolean;
    error: string | null;
  };
  barCrawlsState: any;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  handleTabChange,
  useIsMobile,
  profileState,
  promotionsState,
  drinksState,
  visitorStats,
  barCrawlsState
}) => {
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className={isMobile ? "px-3" : "px-4 py-2 md:px-6 lg:mx-[10%]"}>
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
  );
};

export default TabContent;
