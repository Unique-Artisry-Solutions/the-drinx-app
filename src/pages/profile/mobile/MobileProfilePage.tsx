import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import UserAuth from '@/components/UserAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import OverviewTab from '@/components/profile/OverviewTab';
import ActivityTab from '@/components/profile/ActivityTab';
import QuickLinksTab from '@/components/profile/QuickLinksTab';
import BadgesTab from '@/components/profile/BadgesTab';
import UserRecipesTab from '@/components/profile/UserRecipesTab';
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';
import ActiveSwigCircuitSection from '@/components/profile/ActiveSwigCircuitSection';

const MobileProfilePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userJoinDate, setUserJoinDate] = useState<Date | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [hasActiveSwigCircuit, setHasActiveSwigCircuit] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut } = useAuth();

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

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl mb-6 shadow-sm backdrop-blur-sm bg-white/30">
          <Tabs defaultValue="overview" className="space-y-3">
            <TabsList className="w-full flex justify-between bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger 
                className="flex-1 text-[11px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80"
                value="overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                className="flex-1 text-[11px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80"
                value="activity"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger 
                className="flex-1 text-[11px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80"
                value="rewards"
              >
                Rewards
              </TabsTrigger>
              <TabsTrigger 
                className="flex-1 text-[11px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80"
                value="favorites"
              >
                Favs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-2">
              <OverviewTab 
                userName={userName}
                userEmail={userEmail}
                userJoinDate={userJoinDate}
              />
            </TabsContent>
            
            <TabsContent value="activity" className="pt-2">
              <ActivityTab recentActivity={recentActivity} />
            </TabsContent>
            
            <TabsContent value="rewards" className="pt-2">
              <BadgesTab />
            </TabsContent>
            
            <TabsContent value="favorites" className="pt-2">
              <QuickLinksTab />
            </TabsContent>
            
            <TabsContent value="recipes" className="pt-2">
              <UserRecipesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default MobileProfilePage;
