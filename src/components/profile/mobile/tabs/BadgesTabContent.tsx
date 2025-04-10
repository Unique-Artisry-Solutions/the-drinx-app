
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

const BadgesTabContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Award className="h-4 w-4 mr-2 text-spiritless-pink" />
            My Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't earned any badges yet. Check in to establishments to earn badges!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgesTabContent;
