
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

export function useProfileData() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userJoinDate, setUserJoinDate] = useState<Date | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [hasActiveSwigCircuit, setHasActiveSwigCircuit] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
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

  return {
    isAuthenticated,
    userName,
    userEmail,
    userJoinDate,
    recentActivity,
    hasActiveSwigCircuit,
    handleAuthSuccess,
    handleLogout
  };
}
