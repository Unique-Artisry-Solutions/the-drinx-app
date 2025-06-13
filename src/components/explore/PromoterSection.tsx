
import React from 'react';
import { usePopularPromoters } from '@/hooks/usePopularPromoters';
import PromoterDiscoverySection from './PromoterDiscoverySection';

const PromoterSection: React.FC = () => {
  const { data: promoters = [], isLoading } = usePopularPromoters();

  return (
    <PromoterDiscoverySection 
      promoters={promoters}
      isLoading={isLoading}
    />
  );
};

export default PromoterSection;
