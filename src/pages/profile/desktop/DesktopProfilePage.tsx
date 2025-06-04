
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Calendar, Trophy, Settings } from 'lucide-react';
import UserAuth from '@/components/UserAuth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ActiveSwigCircuitSection from '@/components/profile/ActiveSwigCircuitSection';

interface DesktopProfilePageProps {
  userType?: string;
}

const DesktopProfilePage: React.FC<DesktopProfilePageProps> = ({ userType = 'individual' }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_type');
    window.location.href = '/';
  };

  return (
    <Layout activeTab={activeTab} handleTabChange={handleTabChange}>
      <div className="container mx-auto p-6">
        <ProfileHeader 
          userName="John Doe" 
          handleLogout={handleLogout}
          isPromoter={userType === 'promoter'}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">John Doe</h2>
                    <Badge variant="secondary">Pro User</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">5-Star Drinker</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Member since 2020</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <p className="text-sm text-gray-600">Active Events</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <p className="text-sm text-gray-600">Total Attendees</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4.8</div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ActiveSwigCircuitSection />
      </div>
    </Layout>
  );
};

export default DesktopProfilePage;
