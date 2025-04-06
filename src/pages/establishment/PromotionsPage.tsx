
import React from 'react';
import Layout from '@/components/Layout';
import { useEstablishmentProfile } from '@/hooks/useEstablishmentProfile';
import PromotionsTab from '@/components/establishment/PromotionsTab';

const PromotionsPage: React.FC = () => {
  const { promotionsState } = useEstablishmentProfile();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Promotional Offers</h1>
            <p className="text-muted-foreground">Create and manage special promotions for your establishment</p>
          </div>
        </div>
        
        <PromotionsTab 
          promotions={promotionsState.promotions} 
          newPromoCode={promotionsState.newPromoCode} 
          newPromoDescription={promotionsState.newPromoDescription} 
          setNewPromoCode={promotionsState.setNewPromoCode} 
          setNewPromoDescription={promotionsState.setNewPromoDescription} 
          handleAddPromotion={promotionsState.handleAddPromotion} 
          handleDeletePromotion={promotionsState.handleDeletePromotion} 
        />
      </div>
    </Layout>
  );
};

export default PromotionsPage;
