
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileActiveSwigCircuitSection from './mobile/MobileActiveSwigCircuitSection';
import DesktopActiveSwigCircuitSection from './desktop/DesktopActiveSwigCircuitSection';

const ActiveSwigCircuitSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileActiveSwigCircuitSection /> : <DesktopActiveSwigCircuitSection />;
};

export default ActiveSwigCircuitSection;
