
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Star, Zap, Coffee, Users } from 'lucide-react';

const LoyaltyProgramHelpCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          <CardTitle>Tips for Success</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Star className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Start Simple</h4>
              <p className="text-sm text-gray-500">
                Begin with a straightforward points structure that's easy for customers to understand.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Zap className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Attainable Rewards</h4>
              <p className="text-sm text-gray-500">
                Offer some lower-point rewards that new members can quickly earn to boost engagement.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Coffee className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Feature Your Best</h4>
              <p className="text-sm text-gray-500">
                Use rewards to showcase your signature mocktails and special experiences.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Users className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Promote In-Store</h4>
              <p className="text-sm text-gray-500">
                Make sure your staff actively promotes the program to customers during their visit.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md mt-4">
          <p className="text-sm font-medium text-blue-700 mb-1">Need more help?</p>
          <p className="text-sm text-blue-600">
            Check our <a href="#" className="underline">loyalty program guide</a> for detailed setup instructions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgramHelpCard;
