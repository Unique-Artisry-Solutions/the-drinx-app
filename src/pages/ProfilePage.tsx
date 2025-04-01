
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
        <div className="py-8">
          <h1 className="text-2xl font-medium text-material-on-background mb-6">Sign In</h1>
          <UserAuth onSuccess={handleAuthSuccess} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <ProfileHeader userName={userName} handleLogout={handleLogout} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="favorites">My Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              userName={userName}
              userEmail={userEmail}
              userJoinDate={userJoinDate}
            />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityTab recentActivity={recentActivity} />
          </TabsContent>
          
          <TabsContent value="favorites">
            <QuickLinksTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
