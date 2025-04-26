
import React from 'react';
import AccountTab from './AccountTab';
import { TabsContent } from '@/components/ui/tabs';

interface ProfileTabProps {
  isLightTheme: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ isLightTheme }) => {
  return (
    <TabsContent value="profile">
      <AccountTab isLightTheme={isLightTheme} />
    </TabsContent>
  );
};

export default ProfileTab;
