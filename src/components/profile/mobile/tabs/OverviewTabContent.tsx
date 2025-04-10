
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

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
        <CardContent className="p-5">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <p className={`font-medium ${isPromoter ? "text-purple-700" : ""}`}>{userName}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <p className="text-sm">{userEmail}</p>
            </div>
            {userJoinDate && (
              <div>
                <label className="text-xs text-gray-500">Member since</label>
                <p className="text-sm">{format(userJoinDate, 'MMMM d, yyyy')}</p>
              </div>
            )}
            
            {isPromoter && (
              <div className="mt-4 pt-3 border-t border-purple-100">
                <div className="bg-purple-50 rounded-md p-3">
                  <p className={`text-xs text-purple-700 font-medium`}>
                    Promoter account
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    You have access to create and manage promotions
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTabContent;
