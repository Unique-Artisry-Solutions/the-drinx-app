
import React, { createContext, useContext } from 'react';
import { UserProfile } from './useProfileData';

interface ProfileFormContextProps {
  profile: UserProfile;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggle: (name: string, checked: boolean) => void;
}

const ProfileFormContext = createContext<ProfileFormContextProps | undefined>(undefined);

export const ProfileFormProvider: React.FC<{
  children: React.ReactNode;
  value: ProfileFormContextProps;
}> = ({ children, value }) => {
  return (
    <ProfileFormContext.Provider value={value}>
      {children}
    </ProfileFormContext.Provider>
  );
};

export const useProfileFormContext = () => {
  const context = useContext(ProfileFormContext);
  if (!context) {
    throw new Error('useProfileFormContext must be used within a ProfileFormProvider');
  }
  return context;
};

export default ProfileFormContext;
