
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromotionsTab from './PromotionsTab';
import { useEstablishmentPromotions, PromotionFormData } from '@/hooks/establishment/useEstablishmentPromotions';
import { useToast } from '@/hooks/use-toast';
import { Promotion } from '@/types/PromotionTypes';

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

  // Convert API promotions to component Promotion type
  const mappedPromotions: Promotion[] = promotions.map(p => ({
    id: p.id,
    code: p.code,
    description: p.description,
    discount_type: p.discount_type,
    discount_value: p.discount_value,
    start_date: p.start_date,
    end_date: p.end_date || undefined,
    is_active: p.is_active,
    usage_limit: p.usage_limit || null,
    used_count: p.used_count || 0, // Changed from usage_count to used_count
    valid_days: p.valid_days || null,
    valid_hours: p.valid_hours || null,
    user_segment: p.user_segment || null,
    combinable: p.combinable,
    min_purchase_amount: p.min_purchase_amount || null,
    establishment_id: p.establishment_id,
    created_at: p.created_at || new Date().toISOString(),
    updated_at: p.updated_at || new Date().toISOString()
  }));

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
            promotions={mappedPromotions}
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
