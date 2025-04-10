
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Mail, Calendar, Award, Megaphone } from 'lucide-react';

interface OverviewTabContentProps {
  userName: string;
  userEmail: string;
  userJoinDate: Date | null;
  isPromoter?: boolean;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  userName,
  userEmail,
  userJoinDate,
  isPromoter = false
}) => {
  return (
    <div className="space-y-4">
      <Card className={isPromoter ? "border-purple-100" : ""}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className={`font-medium ${isPromoter ? 'text-purple-600' : 'text-gray-600'}`}>
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium">{userName}</div>
              {isPromoter && <div className="text-xs text-purple-600">Promoter Account</div>}
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{userEmail}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              Joined {userJoinDate ? format(userJoinDate, 'MMMM dd, yyyy') : 'Recently'}
            </span>
          </div>
          
          {isPromoter ? (
            <div className="flex items-center gap-3 text-sm">
              <Megaphone className="h-4 w-4 text-purple-500" />
              <span className="text-purple-700">Promoter access enabled</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Award className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Standard member</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isPromoter ? (
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Promoter Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Welcome to your promoter dashboard! From here you can create and manage promotions for local venues and events.
            </p>
            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-700 mb-1">Quick Stats</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Promotions:</span>
                  <span className="font-medium text-purple-700">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Reach:</span>
                  <span className="font-medium text-purple-700">0</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Activities & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Manage your preferences, view your recent activities, and customize your experience.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTabContent;
