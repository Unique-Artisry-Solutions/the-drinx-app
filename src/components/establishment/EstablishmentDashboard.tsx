
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromotionsTab from './PromotionsTab';
import { useEstablishmentPromotions, PromotionFormData } from '@/hooks/establishment/useEstablishmentPromotions';
import { useToast } from '@/hooks/use-toast';

interface EstablishmentDashboardProps {
  establishmentId: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({ establishmentId }) => {
  const [activeTab, setActiveTab] = useState('promotions');
  const { toast } = useToast();
  
  const {
    promotions,
    isLoading,
    error,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionStatus
  } = useEstablishmentPromotions(establishmentId);

  const handleAddPromotion = async (data: PromotionFormData) => {
    try {
      await addPromotion(data);
      toast({
        title: 'Success',
        description: 'Promotion created successfully',
      });
    } catch (error) {
      console.error('Error adding promotion:', error);
      toast({
        title: 'Error',
        description: 'Failed to create promotion',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePromotion = async (id: string, data: PromotionFormData) => {
    try {
      await updatePromotion(id, data);
      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });
    } catch (error) {
      console.error('Error updating promotion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update promotion',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      await deletePromotion(id);
      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete promotion',
        variant: 'destructive',
      });
    }
  };

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
            handleUpdatePromotion={handleUpdatePromotion}
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
