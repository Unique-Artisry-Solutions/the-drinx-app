
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Zap, Settings, Trophy } from 'lucide-react';
import BulkMessagingHub from './BulkMessagingHub';
import AutomatedCampaignManager from './AutomatedCampaignManager';
import NotificationPreferencesManager from './NotificationPreferencesManager';
import GamificationDashboard from './GamificationDashboard';

interface EnhancedCommunicationHubProps {
  promoterId: string;
}

const EnhancedCommunicationHub: React.FC<EnhancedCommunicationHubProps> = ({ promoterId }) => {
  const [activeTab, setActiveTab] = useState('messaging');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Communication & Gamification Hub</h2>
        <p className="text-muted-foreground">
          Manage follower communications, automate campaigns, and track gamification progress
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messaging
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Gamification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="mt-6">
          <BulkMessagingHub promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <AutomatedCampaignManager promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <NotificationPreferencesManager promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="gamification" className="mt-6">
          <GamificationDashboard promoterId={promoterId} mode="promoter" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCommunicationHub;
