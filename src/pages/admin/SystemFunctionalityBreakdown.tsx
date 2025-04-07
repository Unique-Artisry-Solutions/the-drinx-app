
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

// Import refactored components
import ImplementationOverview from '@/components/admin/systemBreakdown/ImplementationOverview';
import OverviewTab from '@/components/admin/systemBreakdown/OverviewTab';
import FeatureTab from '@/components/admin/systemBreakdown/FeatureTab';
import { adminFeatures, establishmentFeatures, individualFeatures } from '@/components/admin/systemBreakdown/featureData';
import { generateCSV } from '@/components/admin/systemBreakdown/utils';

const SystemFunctionalityBreakdown: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Check if user is authenticated as admin
  React.useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const handleExportCSV = () => {
    generateCSV(adminFeatures, establishmentFeatures, individualFeatures);
  };

  return (
    <div className="min-h-screen bg-material-background">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container max-w-7xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Functionality Breakdown</h1>
            <p className="text-gray-500">Comprehensive overview of all features for marketing and sales campaigns</p>
          </div>
          <Button onClick={handleExportCSV} className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <ImplementationOverview 
          adminFeatures={adminFeatures}
          establishmentFeatures={establishmentFeatures}
          individualFeatures={individualFeatures}
        />

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admin">Admin Features</TabsTrigger>
            <TabsTrigger value="establishment">Establishment Features</TabsTrigger>
            <TabsTrigger value="individual">Individual Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              adminFeatures={adminFeatures}
              establishmentFeatures={establishmentFeatures}
              individualFeatures={individualFeatures}
            />
          </TabsContent>

          <TabsContent value="admin">
            <FeatureTab 
              features={adminFeatures}
              title="Admin Features"
              description="Features available to system administrators for managing the platform"
            />
          </TabsContent>

          <TabsContent value="establishment">
            <FeatureTab 
              features={establishmentFeatures}
              title="Establishment Features"
              description="Features available to registered establishments on the platform"
            />
          </TabsContent>

          <TabsContent value="individual">
            <FeatureTab 
              features={individualFeatures}
              title="Individual User Features"
              description="Features available to regular users of the platform"
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SystemFunctionalityBreakdown;
