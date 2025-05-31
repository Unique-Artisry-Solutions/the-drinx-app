
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemOverviewTab from './SystemOverviewTab';
import PerformanceMetricsTab from './PerformanceMetricsTab';
import CacheManagementTab from './CacheManagementTab';
import { UserPreferencesTab } from './preferences/UserPreferencesTab';
import StreaksTab from './StreaksTab';
import { useRealtimeUpdates } from '@/hooks/admin/systemConfig/useRealtimeUpdates';
import { toast } from 'sonner';

const RewardsSystemMonitor = () => {
  const handleSettingsChange = () => {
    toast.info("Rewards system settings have been updated");
  };

  const handleAuditLogChange = () => {
    toast.info("New audit log entry detected");
  };

  // Setup real-time updates
  useRealtimeUpdates({
    onSettingsChange: handleSettingsChange,
    onAuditLogChange: handleAuditLogChange,
  });

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">System Overview</TabsTrigger>
        <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        <TabsTrigger value="streaks">Streaks</TabsTrigger>
        <TabsTrigger value="cache">Cache Management</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <SystemOverviewTab />
      </TabsContent>

      <TabsContent value="performance">
        <PerformanceMetricsTab />
      </TabsContent>
      
      <TabsContent value="streaks">
        <StreaksTab />
      </TabsContent>

      <TabsContent value="cache">
        <CacheManagementTab />
      </TabsContent>

      <TabsContent value="preferences">
        <UserPreferencesTab />
      </TabsContent>
    </Tabs>
  );
};

export default RewardsSystemMonitor;
