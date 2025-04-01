
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GlassWater, MapPin, Route, Star, User, BeerIcon } from 'lucide-react';

interface OverviewTabProps {
  userName: string;
  userEmail: string;
  userJoinDate: Date | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ userName, userEmail, userJoinDate }) => {
  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <Link to="/profile/bar-crawls" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 rounded-full mb-3">
                <Route size={24} className="text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Joined Bar Crawls</h3>
              <p className="text-sm text-material-on-surface-variant">
                View bar crawls you've participated in
              </p>
            </div>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <Link to="/profile/my-creations" className="block p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <User size={24} className="text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Created Bar Crawls</h3>
              <p className="text-sm text-material-on-surface-variant">
                Manage your own bar crawls
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
    </div>
  );
};

export default OverviewTab;
