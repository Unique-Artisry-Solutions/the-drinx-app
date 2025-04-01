
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import UserAuth from '@/components/UserAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';
import { CalendarClock, GlassWater, MapPin, Star, Clock, Route } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-24 w-24 bg-gradient-to-br from-spiritless-pink to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-material-on-surface-variant">Name</div>
                      <div className="font-medium">{userName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-material-on-surface-variant">Email</div>
                      <div className="font-medium">{userEmail}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-material-on-surface-variant">Member Since</div>
                      <div className="font-medium">{userJoinDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/profile/settings">
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Mocktail Journey</CardTitle>
                  <CardDescription>Track your spiritless adventure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-material-on-surface-variant flex items-center">
                        <GlassWater size={16} className="mr-2" />
                        Mocktails Tried
                      </span>
                      <span className="font-medium">8/50</span>
                    </div>
                    <Progress value={16} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-material-on-surface-variant flex items-center">
                        <MapPin size={16} className="mr-2" />
                        Places Visited
                      </span>
                      <span className="font-medium">3/25</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-material-on-surface-variant flex items-center">
                        <Route size={16} className="mr-2" />
                        Bar Crawls
                      </span>
                      <span className="font-medium">1/5</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90" asChild>
                      <Link to="/map">
                        Explore New Places
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <Link to="/profile/bar-crawls" className="block p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-purple-100 rounded-full mb-3">
                      <Route size={24} className="text-purple-600" />
                    </div>
                    <h3 className="font-medium mb-1">Bar Crawls</h3>
                    <p className="text-sm text-material-on-surface-variant">
                      Plan and join bar crawls
                    </p>
                  </div>
                </Link>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <Link to="/profile/favorites" className="block p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-amber-100 rounded-full mb-3">
                      <Star size={24} className="text-amber-600" />
                    </div>
                    <h3 className="font-medium mb-1">Favorites</h3>
                    <p className="text-sm text-material-on-surface-variant">
                      Your favorite mocktails
                    </p>
                  </div>
                </Link>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <Link to="/profile/visited" className="block p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-emerald-100 rounded-full mb-3">
                      <MapPin size={24} className="text-emerald-600" />
                    </div>
                    <h3 className="font-medium mb-1">Visited</h3>
                    <p className="text-sm text-material-on-surface-variant">
                      Places you've explored
                    </p>
                  </div>
                </Link>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4">
                        {activity.type === 'visit' && (
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <MapPin size={20} className="text-emerald-600" />
                          </div>
                        )}
                        {activity.type === 'favorite' && (
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <Star size={20} className="text-amber-600" />
                          </div>
                        )}
                        {activity.type === 'barCrawl' && (
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Route size={20} className="text-purple-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            {activity.type === 'visit' && (
                              <p className="font-medium">Visited {activity.establishment.name}</p>
                            )}
                            {activity.type === 'favorite' && (
                              <p className="font-medium">Added {activity.cocktail.name} to favorites</p>
                            )}
                            {activity.type === 'barCrawl' && (
                              <p className="font-medium">Joined "{activity.name}" bar crawl</p>
                            )}
                          </div>
                          <div className="text-sm text-material-on-surface-variant flex items-center">
                            <Clock size={14} className="mr-1" />
                            {activity.date.toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-material-on-surface-variant mt-1">
                          {activity.type === 'visit' && activity.establishment.address}
                          {activity.type === 'favorite' && `${typeof activity.cocktail.establishment === 'object' ? activity.cocktail.establishment.name : activity.cocktail.establishment}`}
                          {activity.type === 'barCrawl' && 'Joined with 5 other participants'}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 text-center">
                    <Button variant="outline">
                      View All Activity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-6 flex-col" asChild>
                    <Link to="/profile/favorites">
                      <Star size={24} className="mb-2 text-amber-500" />
                      <span>Favorite Mocktails</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col" asChild>
                    <Link to="/profile/visited">
                      <MapPin size={24} className="mb-2 text-emerald-500" />
                      <span>Visited Places</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col" asChild>
                    <Link to="/profile/bar-crawls">
                      <CalendarClock size={24} className="mb-2 text-purple-500" />
                      <span>My Bar Crawls</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
