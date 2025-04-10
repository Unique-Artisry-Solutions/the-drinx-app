
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProgramConfigSection from '@/components/establishment/loyalty/ProgramConfigSection';
import RewardsManagementSection from '@/components/establishment/loyalty/RewardsManagementSection';
import LoyaltyAnalyticsSection from '@/components/establishment/loyalty/LoyaltyAnalyticsSection';
import LoyaltyProgramHelpCard from '@/components/establishment/loyalty/LoyaltyProgramHelpCard';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface LoyaltyProgram {
  id?: string;
  name: string;
  description: string;
  pointsPerPurchase: number;
  pointsPerDollar: number;
  isActive: boolean;
  enrollmentBonus: number;
  referralBonus: number;
  birthMonthBonus: number;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  isActive: boolean;
  imageUrl?: string;
  expirationDays?: number;
}

interface LoyaltyStats {
  memberCount: number;
  activeMembers: number;
  redemptionRate: number;
  averagePoints: number;
  memberRetentionRate: number;
}

interface LoyaltyProgramTabProps {
  loyaltyProgram: LoyaltyProgram;
  rewards: LoyaltyReward[];
  stats: LoyaltyStats;
  isLoading: boolean;
  error: string | null;
  onSaveProgram: (program: LoyaltyProgram) => void;
  onAddReward: (reward: Omit<LoyaltyReward, 'id'>) => void;
  onUpdateReward: (reward: LoyaltyReward) => void;
  onDeleteReward: (id: string) => void;
}

const LoyaltyProgramTab: React.FC<LoyaltyProgramTabProps> = ({
  loyaltyProgram,
  rewards,
  stats,
  isLoading,
  error,
  onSaveProgram,
  onAddReward,
  onUpdateReward,
  onDeleteReward
}) => {
  const [activeTab, setActiveTab] = useState('config');
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading loyalty program data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Error Loading Loyalty Program</h3>
            <p className="text-gray-500 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Loyalty Program</h2>
          <p className="text-gray-500">Manage your rewards program and increase customer retention.</p>
        </div>
        <div className="mt-3 md:mt-0">
          <Badge variant={loyaltyProgram.isActive ? "success" : "secondary"} className="px-3 py-1">
            {loyaltyProgram.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProgramConfigSection 
                program={loyaltyProgram}
                onSave={onSaveProgram}
              />
            </div>
            <div>
              <LoyaltyProgramHelpCard />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-6">
          <RewardsManagementSection
            rewards={rewards}
            onAddReward={onAddReward}
            onUpdateReward={onUpdateReward}
            onDeleteReward={onDeleteReward}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <LoyaltyAnalyticsSection 
            stats={stats}
            programActive={loyaltyProgram.isActive}
            rewardsCount={rewards.length}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyProgramTab;
