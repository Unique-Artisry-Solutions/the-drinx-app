import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { Megaphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ProfileTabs from '@/components/profile/desktop/ProfileTabs';
import { Establishment, Cocktail } from '@/types/ProfileTypes';
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

interface DesktopProfilePageProps {
  userType?: string;
}

const DesktopProfilePage: React.FC<DesktopProfilePageProps> = ({ userType = 'individual' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userJoinDate, setUserJoinDate] = useState<Date | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [hasActiveSwigCircuit, setHasActiveSwigCircuit] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const isPromoter = userType === 'promoter';

  useEffect(() => {
    const auth = localStorage.getItem('user_authenticated') === 'true';
    setIsAuthenticated(auth);
    
    if (auth) {
      setUserName(localStorage.getItem('user_name') || 'User');
      setUserEmail(localStorage.getItem('user_email') || '');
      
      // Generate a fake join date if one doesn't exist (for demo purposes)
      const storedJoinDate = localStorage.getItem('user_join_date');
      if (storedJoinDate) {
        setUserJoinDate(new Date(storedJoinDate));
      } else {
        const randomDaysAgo = Math.floor(Math.random() * 365) + 1;
        const joinDate = new Date();
        joinDate.setDate(joinDate.getDate() - randomDaysAgo);
        localStorage.setItem('user_join_date', joinDate.toISOString());
        setUserJoinDate(joinDate);
      }
      
      // Generate mock recent activity
      generateMockActivity();
      
      // Check if there's an active swig circuit
      checkForActiveSwigCircuit();
    }
  }, []);
  
  const checkForActiveSwigCircuit = () => {
    // In a real app, this would check the database
    // For now, we'll check localStorage
    const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
    const hasActive = barCrawls.some((bc: any) => bc.status === 'active');
    setHasActiveSwigCircuit(hasActive);
    
    // If there's no active one, we'll create a mock for demo purposes
    if (!hasActive && Math.random() > 0.5) { // 50% chance to show an active circuit
      setHasActiveSwigCircuit(true);
    }
  };
  
  const generateMockActivity = () => {
    const activities = [
      {
        type: 'visit',
        establishment: sampleEstablishments[0],
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        type: 'favorite',
        cocktail: sampleCocktails[0],
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        type: 'barCrawl',
        name: 'Weekend Wanders',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
      },
      {
        type: 'badge',
        name: 'Explorer',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];
    
    setRecentActivity(activities);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUserName(localStorage.getItem('user_name') || 'User');
    setUserEmail(localStorage.getItem('user_email') || '');
    generateMockActivity();
  };

  const handleLogout = async () => {
    try {
      // Use the Auth context signOut method
      await signOut();
      setIsAuthenticated(false);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'There was a problem logging out',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="py-4">
          <h1 className="text-2xl font-medium text-material-on-background mb-6">Sign In</h1>
          <UserAuth onSuccess={handleAuthSuccess} />
        </div>
      </Layout>
    );
  }

  const backgroundGradients = isPromoter ? (
    <>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-purple-300/20 to-indigo-300/30 blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute top-20 right-1/4 w-56 h-56 rounded-full bg-gradient-to-tr from-purple-400/25 to-blue-300/25 blur-2xl -z-10"></div>
      <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-gradient-to-tl from-indigo-300/20 to-purple-400/15 blur-2xl -z-10"></div>
      <div className="absolute top-1/3 left-0 w-48 h-48 rounded-full bg-gradient-to-br from-blue-300/15 to-purple-300/10 blur-xl -z-10 transform -translate-x-1/4"></div>
    </>
  ) : (
    <>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-spiritless-pink/20 to-spiritless-green/30 blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute top-20 right-1/4 w-56 h-56 rounded-full bg-gradient-to-tr from-spiritless-orange/25 to-purple-300/25 blur-2xl -z-10"></div>
      <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-gradient-to-tl from-blue-300/20 to-spiritless-pink/15 blur-2xl -z-10"></div>
      <div className="absolute top-1/3 left-0 w-48 h-48 rounded-full bg-gradient-to-br from-spiritless-green/15 to-spiritless-orange/10 blur-xl -z-10 transform -translate-x-1/4"></div>
    </>
  );

  const tabsContainerClass = isPromoter 
    ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl mb-6 shadow-sm backdrop-blur-sm bg-white/30"
    : "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl mb-6 shadow-sm backdrop-blur-sm bg-white/30";

  const tabTriggerClass = isPromoter
    ? "flex-1 sm:flex-none data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80 hover:-translate-y-0.5 hover:shadow-md"
    : "flex-1 sm:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <Layout>
      <div className="animate-fade-in max-w-6xl mx-auto px-4 relative overflow-hidden">
        {backgroundGradients}
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-40 mix-blend-overlay pointer-events-none -z-10"></div>
        
        <ProfileHeader 
          userName={userName} 
          handleLogout={handleLogout} 
          isPromoter={isPromoter} 
        />

        {/* Active Swig Circuit Section - Conditionally rendered */}
        {hasActiveSwigCircuit && !isPromoter && (
          <div className="mb-6">
            <ActiveSwigCircuitSection />
          </div>
        )}

        {/* Promoter notification section */}
        {isPromoter && (
          <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Megaphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-800">Promoter Dashboard</h3>
                <p className="text-purple-600 mt-1">
                  Welcome to your promoter dashboard. From here, you can manage your promotions and track their performance.
                </p>
              </div>
            </div>
          </div>
        )}

        <ProfileTabs />
      </div>
    </Layout>
  );
};

export default DesktopProfilePage;
