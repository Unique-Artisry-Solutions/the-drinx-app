
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileProfilePage from './profile/mobile/MobileProfilePage';
import DesktopProfilePage from './profile/desktop/DesktopProfilePage';

const ProfilePage: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Return the appropriate profile page based on device
  return isMobile ? <MobileProfilePage /> : <DesktopProfilePage />;
};

export default ProfilePage;
