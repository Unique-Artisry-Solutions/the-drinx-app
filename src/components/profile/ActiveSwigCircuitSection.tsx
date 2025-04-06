
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopActiveSwigCircuitSection from './desktop/DesktopActiveSwigCircuitSection';
import MobileActiveSwigCircuitSection from './mobile/MobileActiveSwigCircuitSection';

const ActiveSwigCircuitSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileActiveSwigCircuitSection /> : <DesktopActiveSwigCircuitSection />;
};

export default ActiveSwigCircuitSection;
