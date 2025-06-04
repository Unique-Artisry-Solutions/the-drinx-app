
import React from 'react';
import Layout from '@/components/Layout';
import UserAuth from '@/components/UserAuth';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ActiveSwigCircuitSection from '@/components/profile/ActiveSwigCircuitSection';
import ProfileTabs from '@/components/profile/mobile/ProfileTabs';

interface MobileProfilePageProps {
  userType?: string;
}

const MobileProfilePage: React.FC<MobileProfilePageProps> = ({ userType = 'individual' }) => {
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

  const isPromoter = userType === 'promoter';

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
      <div className={`animate-fade-in relative ${isPromoter ? 'promoter-theme' : ''}`}>
        <ProfileHeader 
          userName={userName} 
          handleLogout={handleLogout} 
          isPromoter={isPromoter} 
        />

        {/* Active Swig Circuit Section - Conditionally rendered */}
        {hasActiveSwigCircuit && !isPromoter && (
          <div className="mb-4 mt-2">
            <ActiveSwigCircuitSection />
          </div>
        )}

        {/* Promoter notification section */}
        {isPromoter && (
          <div className="mb-4 mt-2 mx-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
            <h3 className="text-purple-700 font-medium flex items-center">
              <Megaphone className="w-4 h-4 mr-2" />
              Promoter Account
            </h3>
            <p className="text-sm text-purple-600 mt-1">
              Welcome to your promoter dashboard. From here, you can manage your promotions and track their performance.
            </p>
          </div>
        )}

        <ProfileTabs 
          userName={userName}
          userEmail={userEmail}
          userJoinDate={userJoinDate}
          recentActivity={recentActivity}
          isPromoter={isPromoter}
        />
      </div>
    </Layout>
  );
};

export default MobileProfilePage;

// Need to import Megaphone at the top
import { Megaphone } from 'lucide-react';
