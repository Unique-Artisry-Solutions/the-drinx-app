
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Megaphone } from 'lucide-react';

const PromotionsTabContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Megaphone className="h-4 w-4 mr-2 text-purple-600" />
            My Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't created any promotions yet. Create your first promotion!</p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Promotion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsTabContent;
