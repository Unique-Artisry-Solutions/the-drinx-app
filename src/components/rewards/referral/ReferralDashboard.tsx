
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferralProgramManager } from './ReferralProgramManager';
import { ReferralTracker } from './ReferralTracker';
import { SocialShareWidget } from './SocialShareWidget';
import { Users, TrendingUp, Share2, Settings } from 'lucide-react';

export const ReferralDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Referral Rewards System</h1>
        <p className="text-gray-600">
          Manage your referral programs, track performance, and share with friends to earn rewards.
        </p>
      </div>

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracker" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share & Earn
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage Programs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          <ReferralTracker />
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SocialShareWidget />
            </div>
            <div>
              {/* Quick stats or tips */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">💡 Sharing Tips</h3>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Share on social media for maximum reach</li>
                  <li>• Personal messages work best</li>
                  <li>• Explain the benefits to your friends</li>
                  <li>• Time your shares for peak engagement</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <ReferralProgramManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
