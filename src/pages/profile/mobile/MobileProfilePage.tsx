import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Calendar, Trophy, Settings } from 'lucide-react';

const MobileProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Layout activeTab={activeTab} handleTabChange={handleTabChange}>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">My Profile</CardTitle>
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

            <div className="mt-6 space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Trophy className="h-4 w-4 mr-2" />
                My Achievements
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MobileProfilePage;
