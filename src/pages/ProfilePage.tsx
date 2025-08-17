
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import MobileProfilePage from './profile/mobile/MobileProfilePage';
import DesktopProfilePage from './profile/desktop/DesktopProfilePage';

const ProfilePage: React.FC = () => {
  const isMobile = useIsMobile();
  const { userType } = useAuthenticatedUser();
  
  // Use the effective user type from dev bypass
  const effectiveUserType = userType || 'individual';
  
  // Return the appropriate profile page based on device and user type
  return isMobile ? 
    <MobileProfilePage userType={effectiveUserType} /> : 
    <DesktopProfilePage userType={effectiveUserType} />;
};

export default ProfilePage;
