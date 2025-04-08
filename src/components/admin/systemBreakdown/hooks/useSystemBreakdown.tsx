
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { analyzeAllFeatures } from '../utils';
import { FeatureItem, AnalysisStep } from '../types';
import { adminFeatures as initialAdminFeatures, establishmentFeatures as initialEstablishmentFeatures, individualFeatures as initialIndividualFeatures } from '../features';

export const useSystemBreakdown = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [adminFeatures, setAdminFeatures] = useState<FeatureItem[]>(initialAdminFeatures);
  const [establishmentFeatures, setEstablishmentFeatures] = useState<FeatureItem[]>(initialEstablishmentFeatures);
  const [individualFeatures, setIndividualFeatures] = useState<FeatureItem[]>(initialIndividualFeatures);
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
  useEffect(() => {
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
    // Import the generateCSV function dynamically to keep the bundle size small
    import('../utils').then(({ generateCSV }) => {
      generateCSV(adminFeatures, establishmentFeatures, individualFeatures);
    });
  };
  
  const handleAnalyzeFeatures = async () => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    
    // Create initial database tasks array with default states
    const initialDatabaseTasks: AnalysisStep[] = [
      { name: 'Database schema verification', completed: false },
      { name: 'API endpoints validation', completed: false },
      { name: 'Authentication flow check', completed: false },
      { name: 'User permissions validation', completed: false },
      { name: 'Content moderation implementation', completed: false },
      { name: 'Storage bucket configuration', completed: false },
      { name: 'Database trigger functions verification', completed: false },
      { name: 'Frontend component implementation check', completed: false }
    ];
    setAnalysisSteps(initialDatabaseTasks);
    
    // Simulate progress updates for each task
    let currentStep = 0;
    const totalSteps = initialDatabaseTasks.length;
    
    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        const updatedSteps = [...initialDatabaseTasks];
        
        // Mark the current task as completed
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
    
    const completeAnalysis = async () => {
      try {
        const analyzedFeatures = await analyzeAllFeatures(
          adminFeatures,
          establishmentFeatures,
          individualFeatures
        );
        
        setAdminFeatures(analyzedFeatures.adminFeatures);
        setEstablishmentFeatures(analyzedFeatures.establishmentFeatures);
        setIndividualFeatures(analyzedFeatures.individualFeatures);
        setAnalysisSteps(analyzedFeatures.completedSteps);
        
        const totalUpdated = [
          ...analyzedFeatures.adminFeatures,
          ...analyzedFeatures.establishmentFeatures,
          ...analyzedFeatures.individualFeatures
        ].filter(feature => feature.statusUpdated).length;
        
        toast({
          title: "Analysis Complete",
          description: `${totalUpdated} feature status${totalUpdated !== 1 ? 'es' : ''} updated based on database implementation.`,
        });
      } catch (error) {
        console.error("Error analyzing features:", error);
        toast({
          title: "Analysis Error",
          description: "There was an error while analyzing features. Please try again.",
          variant: "destructive"
        });
      } finally {
        setAnalyzing(false);
      }
    };
  };

  return {
    activeTab,
    setActiveTab,
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    analyzing,
    analysisProgress,
    analysisSteps,
    updatedFeaturesCount,
    handleLogout,
    handleExportCSV,
    handleAnalyzeFeatures
  };
};
