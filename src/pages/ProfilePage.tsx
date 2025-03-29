
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import UserAuth from '@/components/UserAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import ProfileHeader from '@/components/profile/ProfileHeader';

const ProfilePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium">Name</div>
                <div>{userName}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Email</div>
                <div>{userEmail}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link to="/profile/bar-crawls">
                  <Button variant="outline" className="w-full">Bar Crawls</Button>
                </Link>
                <Link to="/profile/favorites">
                  <Button variant="outline" className="w-full">Favorites</Button>
                </Link>
                <Link to="/profile/visited">
                  <Button variant="outline" className="w-full">Visited</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
