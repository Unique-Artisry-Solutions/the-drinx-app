
import React from 'react';
import Layout from '@/components/Layout';
import { useEstablishmentProfile } from '@/hooks/establishment/useEstablishmentProfile';
import PromotionsTab from '@/components/establishment/PromotionsTab';
import { PromotionFormData, Promotion } from '@/types/PromotionTypes';

const PromotionsPage: React.FC = () => {
  const { promotionsState } = useEstablishmentProfile();

  // Directly use the promotions array without mapping
  const promotions = promotionsState.promotions;

  // Wrap the handlers to ensure they return promises
  const handleAddPromotion = async (data: PromotionFormData): Promise<void> => {
    promotionsState.handleAddPromotion(data);
    return Promise.resolve();
  };

  const handleDeletePromotion = async (id: string): Promise<void> => {
    promotionsState.handleDeletePromotion(id);
    return Promise.resolve();
  };

  // Added for updating promotions
  const handleUpdatePromotion = async (id: string, data: PromotionFormData): Promise<void> => {
    // Check if the function exists in promotionsState before calling it
    if (typeof promotionsState.handleUpdatePromotion === 'function') {
      promotionsState.handleUpdatePromotion(id, data);
    } else {
      console.warn('handleUpdatePromotion function not available in promotionsState');
      // Fallback implementation if needed
    }
    return Promise.resolve();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col items-start mb-6">
          <h1 className="text-2xl font-bold">Promotional Offers</h1>
          <p className="text-muted-foreground">Create and manage special promotions for your establishment</p>
        </div>
        
        <PromotionsTab 
          promotions={promotions as Promotion[]}
          handleAddPromotion={handleAddPromotion}
          handleDeletePromotion={handleDeletePromotion}
          handleUpdatePromotion={handleUpdatePromotion}
        />
      </div>
    </Layout>
  );
};

export default PromotionsPage;
