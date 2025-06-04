
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromoterDashboard from './PromoterDashboard';
import { FollowersTab } from '@/components/promoter/dashboard/FollowersTab';

const PromoterDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  console.log('PromoterDashboardPage - Current tab:', activeTab);

  const handleTabChange = (value: string) => {
    if (value === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: value });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <PromoterDashboard />
          </TabsContent>
          
          <TabsContent value="followers" className="mt-6">
            <FollowersTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterDashboardPage;
