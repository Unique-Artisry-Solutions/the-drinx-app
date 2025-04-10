
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Megaphone } from 'lucide-react';
import { format } from 'date-fns';

interface OverviewTabProps {
  userName: string;
  userEmail: string;
  userJoinDate: Date | null;
  isPromoter?: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  userName,
  userEmail,
  userJoinDate,
  isPromoter = false
}) => {
  const accentColor = isPromoter ? "text-purple-600" : "text-spiritless-pink";
  const bgColor = isPromoter ? "bg-purple-50" : "bg-white";
  const borderColor = isPromoter ? "border-purple-200" : "border-gray-200";

  return (
    <div className="space-y-6">
      <Card className={`${bgColor} ${borderColor}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className={accentColor} />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{userName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {userEmail}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {userJoinDate ? format(userJoinDate, 'MMMM dd, yyyy') : 'Unknown'}
            </p>
          </div>
          
          {isPromoter && (
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-md">
                <Megaphone className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-700">Promoter Account</h4>
                  <p className="text-sm text-purple-600 mt-1">
                    You have access to create and manage promotions for venues.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
