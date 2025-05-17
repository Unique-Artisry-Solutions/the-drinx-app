
import React from 'react';
import Layout from '@/components/Layout';
import { useEstablishmentProfile } from '@/hooks/establishment/useEstablishmentProfile';
import PromotionsTab from '@/components/establishment/PromotionsTab';
import { Promotion, PromotionFormData } from '@/types/PromotionTypes';

const PromotionsPage: React.FC = () => {
  const { promotionsState } = useEstablishmentProfile();

  // Ensure promotions are correctly mapped to match the Promotion type
  const mappedPromotions: Promotion[] = promotionsState.promotions.map(p => ({
    id: p.id,
    code: p.code,
    description: p.description,
    discount_type: p.discount_type as 'percentage' | 'fixed' | 'free_item',
    discount_value: p.discount_value,
    start_date: p.start_date,
    end_date: p.end_date || undefined,
    is_active: p.is_active,
    usage_limit: p.usage_limit || null,
    used_count: p.used_count || 0,
    valid_days: p.valid_days || null,
    valid_hours: p.valid_hours || null,
    user_segment: p.user_segment || null,
    combinable: p.combinable,
    min_purchase_amount: p.min_purchase_amount || null,
    establishment_id: p.establishment_id,
    created_at: p.created_at,
    updated_at: p.updated_at
  }));

  // Wrap the handlers to ensure they return promises
  const handleAddPromotion = async (data: PromotionFormData): Promise<void> => {
    return Promise.resolve(promotionsState.handleAddPromotion(data));
  };

  const handleDeletePromotion = async (id: string): Promise<void> => {
    return Promise.resolve(promotionsState.handleDeletePromotion(id));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col items-start mb-6">
          <h1 className="text-2xl font-bold">Promotional Offers</h1>
          <p className="text-muted-foreground">Create and manage special promotions for your establishment</p>
        </div>
        
        <PromotionsTab 
          promotions={mappedPromotions}
          handleAddPromotion={handleAddPromotion}
          handleDeletePromotion={handleDeletePromotion} 
        />
      </div>
    </Layout>
  );
};

export default PromotionsPage;
