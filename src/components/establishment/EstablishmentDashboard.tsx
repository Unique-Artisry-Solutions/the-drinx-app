
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromotionsTab from './PromotionsTab';
import { useEstablishmentPromotions, PromotionFormData } from '@/hooks/establishment/useEstablishmentPromotions';
import { useToast } from '@/hooks/use-toast';

interface EstablishmentDashboardProps {
  establishmentName: string;
  establishmentId: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({ establishmentName, establishmentId }) => {
  const [activeTab, setActiveTab] = useState('promotions');
  const { toast } = useToast();
  
  const {
    promotions,
    isLoading,
    error,
    handleAddPromotion,
    handleDeletePromotion,
    updatePromotion: handleUpdatePromotion,
    togglePromotionStatus
  } = useEstablishmentPromotions(establishmentId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Establishment Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="promotions" className="mt-4">
          <PromotionsTab 
            promotions={promotions}
            handleAddPromotion={handleAddPromotion}
            handleDeletePromotion={handleDeletePromotion}
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div>Analytics Tab Content</div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div>Settings Tab Content</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstablishmentDashboard;
