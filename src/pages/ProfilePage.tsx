
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
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

const ProfilePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userJoinDate, setUserJoinDate] = useState<Date | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
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
    }
  }, []);
  
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

  return (
    <Layout>
      <div className="animate-fade-in max-w-6xl mx-auto px-4 relative overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-spiritless-pink/20 to-spiritless-green/30 blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute top-20 right-1/4 w-56 h-56 rounded-full bg-gradient-to-tr from-spiritless-orange/25 to-purple-300/25 blur-2xl -z-10"></div>
        <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-gradient-to-tl from-blue-300/20 to-spiritless-pink/15 blur-2xl -z-10"></div>
        <div className="absolute top-1/3 left-0 w-48 h-48 rounded-full bg-gradient-to-br from-spiritless-green/15 to-spiritless-orange/10 blur-xl -z-10 transform -translate-x-1/4"></div>
        
        {/* Pattern overlay for added texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-40 mix-blend-overlay pointer-events-none -z-10"></div>
        
        <ProfileHeader userName={userName} handleLogout={handleLogout} />

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl mb-6 shadow-sm backdrop-blur-sm bg-white/30">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full flex justify-between sm:justify-start sm:gap-4 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger 
                className="flex-1 sm:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80 hover:-translate-y-0.5 hover:shadow-md"
                value="overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                className="flex-1 sm:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80 hover:-translate-y-0.5 hover:shadow-md"
                value="activity"
              >
                Recent Activity
              </TabsTrigger>
              <TabsTrigger 
                className="flex-1 sm:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80 hover:-translate-y-0.5 hover:shadow-md"
                value="rewards"
              >
                Rewards & Badges
              </TabsTrigger>
              <TabsTrigger 
                className="flex-1 sm:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80 hover:-translate-y-0.5 hover:shadow-md"
                value="favorites"
              >
                My Favorites
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
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
