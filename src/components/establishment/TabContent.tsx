
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProfileTab from '@/components/establishment/ProfileTab';
import PromotionsTab from '@/components/establishment/PromotionsTab';
import MocktailMenuTab from '@/components/establishment/MocktailMenuTab';
import VisitorStatsTab from '@/components/establishment/VisitorStatsTab';
import SwigCircuitsTab from '@/components/establishment/SwigCircuitsTab';
import LoyaltyProgramTab from '@/components/establishment/LoyaltyProgramTab';
import EstablishmentInbox from '@/components/establishment/communication/EstablishmentInbox';

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
  swigCircuitsState: any;
  loyaltyProgramState?: any;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  handleTabChange,
  useIsMobile,
  profileState,
  promotionsState,
  drinksState,
  visitorStats,
  swigCircuitsState,
  loyaltyProgramState
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

        <TabsContent value="swigCircuits">
          <SwigCircuitsTab 
            swigCircuits={swigCircuitsState.swigCircuits} 
            handleEndParticipation={swigCircuitsState.handleEndParticipation} 
            handleAcceptRequest={swigCircuitsState.handleAcceptRequest} 
          />
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltyProgramTab 
            loyaltyProgram={loyaltyProgramState?.program || {}}
            rewards={loyaltyProgramState?.rewards || []}
            stats={loyaltyProgramState?.stats || {}}
            isLoading={loyaltyProgramState?.isLoading || false}
            error={loyaltyProgramState?.error || null}
            onSaveProgram={loyaltyProgramState?.handleSaveProgram}
            onAddReward={loyaltyProgramState?.handleAddReward}
            onUpdateReward={loyaltyProgramState?.handleUpdateReward}
            onDeleteReward={loyaltyProgramState?.handleDeleteReward}
          />
        </TabsContent>
        
        <TabsContent value="communication">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Promoter Communication</h2>
            <p className="text-gray-600">
              Manage messages from promoters interested in organizing events at your venue.
            </p>
            <EstablishmentInbox />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default TabContent;
