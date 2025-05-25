
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Plus, Download, File, FileText, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CSVLink } from 'react-csv';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import SystemBreakdownNavigation from '@/components/admin/systemBreakdown/SystemBreakdownNavigation';
import { TabsContent } from '@/components/ui/tabs';
import SystemHeader from '@/components/admin/systemBreakdown/SystemHeader';
import OverviewTab from '@/components/admin/systemBreakdown/OverviewTab';
import EnhancedFeatureTab from '@/components/admin/systemBreakdown/EnhancedFeatureTab';
import FeatureShowcaseTab from '@/components/admin/systemBreakdown/FeatureShowcaseTab';
import { useSystemBreakdown } from '@/components/admin/systemBreakdown/hooks/useSystemBreakdown';
import RouteTestRunner from '@/components/development/RouteTestRunner';

const SystemBreakdownPage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures,
    analyzing,
    analysisProgress,
    analysisSteps,
    updatedFeaturesCount,
    handleLogout,
    handleExportCSV,
    handleAnalyzeFeatures,
    handleCreateReleaseFromFeatures,
    progressHistory,
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  } = useSystemBreakdown();

  console.log('SystemBreakdownContent: Rendering with activeTab:', activeTab);
  console.log('SystemBreakdownContent: Feature counts:', {
    admin: adminFeatures.length,
    establishment: establishmentFeatures.length,
    individual: individualFeatures.length,
    promoter: promoterFeatures.length
  });

  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        <SystemBreakdownNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <TabsContent value={activeTab} className="mt-0">
          
        </TabsContent>
        
        {/* Add Route Testing Component in Development */}
        <RouteTestRunner />
      </div>
    </ResponsiveLayout>
  );
};

export default SystemBreakdownPage;
