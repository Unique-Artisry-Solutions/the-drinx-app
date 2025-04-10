
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, TrendingUp, AlertCircle } from 'lucide-react';

const PromotionsTabContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
            <Megaphone className="h-5 w-5 text-purple-600" /> 
            Promoter Features
          </CardTitle>
          <CardDescription className="text-purple-600">
            Create and manage promotional campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-100/50 p-3 rounded-lg mb-3 border border-purple-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-purple-600" />
              <p className="text-sm text-purple-700">
                This feature is coming soon. Check back for updates!
              </p>
            </div>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
            Create New Promotion
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" /> 
            Promotion Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Total Promotions</span>
              <span className="text-sm text-purple-700 font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Active Promotions</span>
              <span className="text-sm text-purple-700 font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Total Redemptions</span>
              <span className="text-sm text-purple-700 font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Engagement Rate</span>
              <span className="text-sm text-purple-700 font-semibold">N/A</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsTabContent;
