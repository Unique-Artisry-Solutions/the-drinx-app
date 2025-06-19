
import React from 'react';
import Layout from '@/components/Layout';
import UserAuth from '@/components/UserAuth';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ActiveSwigCircuitSection from '@/components/profile/ActiveSwigCircuitSection';
import { Megaphone } from 'lucide-react';

interface DesktopProfilePageProps {
  userType?: string;
}

const DesktopProfilePage: React.FC<DesktopProfilePageProps> = ({ userType = 'individual' }) => {
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
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-medium text-material-on-background mb-6">Sign In</h1>
          <div className="max-w-md mx-auto">
            <UserAuth onSuccess={handleAuthSuccess} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`container mx-auto px-4 py-6 animate-fade-in relative ${isPromoter ? 'promoter-theme' : ''}`}>
        <ProfileHeader 
          userName={userName} 
          handleLogout={handleLogout} 
          isPromoter={isPromoter} 
        />

        {/* Active Swig Circuit Section - Conditionally rendered */}
        {hasActiveSwigCircuit && !isPromoter && (
          <div className="mb-6 mt-4">
            <ActiveSwigCircuitSection />
          </div>
        )}

        {/* Promoter notification section */}
        {isPromoter && (
          <div className="mb-6 mt-4 p-6 rounded-lg bg-purple-50 border border-purple-200">
            <h3 className="text-purple-700 font-medium flex items-center">
              <Megaphone className="w-5 h-5 mr-2" />
              Promoter Account
            </h3>
            <p className="text-sm text-purple-600 mt-2">
              Welcome to your promoter dashboard. From here, you can manage your promotions and track their performance.
            </p>
          </div>
        )}

        {/* Desktop Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg">{userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-lg">{userJoinDate?.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-gray-600">{activity.name || activity.establishment?.name || activity.cocktail?.name}</p>
                    <p className="text-xs text-gray-500">{activity.date.toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DesktopProfilePage;
