
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import UserAuth from '@/components/UserAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Import the extracted components
import ProfileHeader from '@/components/profile/ProfileHeader';
import BarCrawlTab from '@/components/profile/BarCrawlTab';
import VisitedTab from '@/components/profile/VisitedTab';
import FavoritesTab from '@/components/profile/FavoritesTab';
import ReviewsTab from '@/components/profile/ReviewsTab';

// Sample data - would be fetched from API in a real application
import { sampleCocktails, sampleEstablishments } from '@/data/sampleData';

const ProfilePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [favoriteEstablishments, setFavoriteEstablishments] = useState([]);
  const [barCrawlList, setBarCrawlList] = useState(sampleEstablishments.slice(0, 3));
  const [visitedEstablishments, setVisitedEstablishments] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('user_authenticated') === 'true';
    setIsAuthenticated(auth);
    
    if (auth) {
      setUserName(localStorage.getItem('user_name') || 'User');
      setUserEmail(localStorage.getItem('user_email') || '');
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUserName(localStorage.getItem('user_name') || 'User');
    setUserEmail(localStorage.getItem('user_email') || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  const shareBarCrawl = () => {
    toast({
      title: 'Bar Crawl Shared',
      description: 'Your bar crawl list has been shared with users in your area!',
    });
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

        <Tabs defaultValue="barCrawl">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="barCrawl">Bar Crawl</TabsTrigger>
            <TabsTrigger value="visited">Visited</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="barCrawl">
            <BarCrawlTab 
              barCrawlList={barCrawlList} 
              shareBarCrawl={shareBarCrawl} 
            />
          </TabsContent>

          <TabsContent value="visited">
            <VisitedTab visitedEstablishments={sampleEstablishments.slice(2, 5)} />
          </TabsContent>

          <TabsContent value="favorites">
            <FavoritesTab favoriteCocktails={sampleCocktails.slice(0, 3)} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
