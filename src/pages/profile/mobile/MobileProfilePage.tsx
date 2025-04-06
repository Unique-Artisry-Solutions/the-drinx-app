
import React from 'react';
import Layout from '@/components/Layout';
import UserAuth from '@/components/UserAuth';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ActiveSwigCircuitSection from '@/components/profile/ActiveSwigCircuitSection';
import ProfileTabs from '@/components/profile/mobile/ProfileTabs';

const MobileProfilePage: React.FC = () => {
  const {
    isAuthenticated,
    userName,
    userEmail,
    userJoinDate,
    recentActivity,
    hasActiveSwigCircuit,
    handleAuthSuccess,
    handleLogout
  } = useProfileData();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="py-4">
          <h1 className="text-xl font-medium text-material-on-background mb-4 px-4">Sign In</h1>
          <UserAuth onSuccess={handleAuthSuccess} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in relative">
        <ProfileHeader userName={userName} handleLogout={handleLogout} />

        {/* Active Swig Circuit Section - Conditionally rendered */}
        {hasActiveSwigCircuit && (
          <div className="mb-4 mt-2">
            <ActiveSwigCircuitSection />
          </div>
        )}

        <ProfileTabs 
          userName={userName}
          userEmail={userEmail}
          userJoinDate={userJoinDate}
          recentActivity={recentActivity}
        />
      </div>
    </Layout>
  );
};

export default MobileProfilePage;
