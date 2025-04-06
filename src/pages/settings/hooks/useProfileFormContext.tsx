
import React, { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserProfileFormData } from './useProfileData';

// Updated context to work with react-hook-form
export type ProfileFormContextType = UseFormReturn<UserProfileFormData>;

const ProfileFormContext = createContext<ProfileFormContextType | undefined>(undefined);

export const ProfileFormProvider: React.FC<{
  children: React.ReactNode;
  value: ProfileFormContextType;
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
