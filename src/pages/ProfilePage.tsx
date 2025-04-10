
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileProfilePage from './profile/mobile/MobileProfilePage';
import DesktopProfilePage from './profile/desktop/DesktopProfilePage';

const ProfilePage: React.FC = () => {
  const isMobile = useIsMobile();
  const userType = localStorage.getItem('user_type') || 'individual';
  
  // Return the appropriate profile page based on device and user type
  return isMobile ? <MobileProfilePage userType={userType} /> : <DesktopProfilePage userType={userType} />;
};

export default ProfilePage;
