
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileDown, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import ImplementationOverview from '@/components/admin/systemBreakdown/ImplementationOverview';
import OverviewTab from '@/components/admin/systemBreakdown/OverviewTab';
import FeatureTab from '@/components/admin/systemBreakdown/FeatureTab';
import ProposedImprovementsTab from '@/components/admin/systemBreakdown/ProposedImprovementsTab';
import AnalysisProgress from '@/components/admin/systemBreakdown/AnalysisProgress';
import { adminFeatures as initialAdminFeatures, establishmentFeatures as initialEstablishmentFeatures, individualFeatures as initialIndividualFeatures } from '@/components/admin/systemBreakdown/featureData';
import { proposedImprovements } from '@/components/admin/systemBreakdown/improvementsData';
import { generateCSV, analyzeAllFeatures, AnalysisStep } from '@/components/admin/systemBreakdown/utils';

const SystemFunctionalityBreakdown: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [adminFeatures, setAdminFeatures] = useState(initialAdminFeatures);
  const [establishmentFeatures, setEstablishmentFeatures] = useState(initialEstablishmentFeatures);
  const [individualFeatures, setIndividualFeatures] = useState(initialIndividualFeatures);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  
  // Count features with updated status
  const updatedFeaturesCount = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures
  ].filter(feature => feature.statusUpdated).length;

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
  
  const handleAnalyzeFeatures = () => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    
    // Create initial steps array with nothing completed
    const steps: AnalysisStep[] = [
      { name: 'Database schema verification', completed: false },
      { name: 'API endpoints validation', completed: false },
      { name: 'Authentication flow check', completed: false },
      { name: 'User permissions validation', completed: false },
      { name: 'Content moderation implementation', completed: false },
      { name: 'Storage bucket configuration', completed: false },
      { name: 'Database trigger functions verification', completed: false },
      { name: 'Frontend component implementation check', completed: false }
    ];
    setAnalysisSteps(steps);
    
    // Simulate progress updates for each step
    let currentStep = 0;
    const totalSteps = steps.length;
    
    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        const updatedSteps = [...steps];
        updatedSteps[currentStep].completed = true;
        setAnalysisSteps(updatedSteps);
        
        currentStep++;
        setAnalysisProgress((currentStep / totalSteps) * 100);
        
        // If we've completed all steps, complete the analysis
        if (currentStep >= totalSteps) {
          clearInterval(progressInterval);
          
          // Slight delay before completing the analysis to show 100% progress
          setTimeout(completeAnalysis, 500);
        }
      }
    }, 600); // Update every 600ms
    
    const completeAnalysis = () => {
      const analyzedFeatures = analyzeAllFeatures(
        initialAdminFeatures,
        initialEstablishmentFeatures,
        initialIndividualFeatures
      );
      
      setAdminFeatures(analyzedFeatures.adminFeatures);
      setEstablishmentFeatures(analyzedFeatures.establishmentFeatures);
      setIndividualFeatures(analyzedFeatures.individualFeatures);
      
      const totalUpdated = [
        ...analyzedFeatures.adminFeatures,
        ...analyzedFeatures.establishmentFeatures,
        ...analyzedFeatures.individualFeatures
      ].filter(feature => feature.statusUpdated).length;
      
      toast({
        title: "Analysis Complete",
        description: `${totalUpdated} feature status${totalUpdated !== 1 ? 'es' : ''} updated based on database implementation.`,
      });
      
      setAnalyzing(false);
    };
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
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyzeFeatures} 
              className="flex items-center gap-2"
              disabled={analyzing}
              variant="secondary"
            >
              <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyzing...' : 'Analyze Implementation'}
            </Button>
            <Button onClick={handleExportCSV} className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export to CSV
            </Button>
          </div>
        </div>
        
        {updatedFeaturesCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <span>
              <strong>{updatedFeaturesCount}</strong> feature{updatedFeaturesCount !== 1 ? 's' : ''} {updatedFeaturesCount !== 1 ? 'have' : 'has'} been updated based on database implementation status.
            </span>
          </div>
        )}
        
        <AnalysisProgress 
          analyzing={analyzing}
          steps={analysisSteps}
          progress={analysisProgress}
        />

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
            <TabsTrigger value="improvements" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              Proposed Improvements
            </TabsTrigger>
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

          <TabsContent value="improvements">
            <ProposedImprovementsTab improvements={proposedImprovements} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SystemFunctionalityBreakdown;
