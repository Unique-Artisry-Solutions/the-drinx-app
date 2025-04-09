
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { analyzeAllFeatures, mapFeaturesToReleaseFeatures, getDateMonthsFromNow } from '../utils';
import { FeatureItem, AnalysisStep } from '../types';
import { adminFeatures as initialAdminFeatures, establishmentFeatures as initialEstablishmentFeatures, individualFeatures as initialIndividualFeatures } from '../features';
import { useReleaseManagement } from './useReleaseManagement';
import { v4 as uuidv4 } from 'uuid';

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
  
  // Get the release management functionality to create a release
  const releaseManagement = useReleaseManagement();

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
  
  const handleAnalyzeFeatures = () => {
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
    
    const completeAnalysis = () => {
      const analyzedFeatures = analyzeAllFeatures(
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
      
      setAnalyzing(false);
    };
  };

  // Function to create a release from features
  const handleCreateReleaseFromFeatures = () => {
    // Get all features except for "planned" status as these might be for future releases
    const allFeatures = [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures
    ].filter(feature => ['implemented', 'partial', 'not_started'].includes(feature.status));
    
    // If there are no features to include, show a message
    if (allFeatures.length === 0) {
      toast({
        title: "No Features Available",
        description: "There are no features with implemented, partial, or not started status to include in a release.",
        variant: "destructive"
      });
      return;
    }
    
    // Convert features to release features
    const releaseFeatures = mapFeaturesToReleaseFeatures(allFeatures);
    
    // Create a release planned for one month from now
    const plannedDate = getDateMonthsFromNow(1);
    
    // Count features by status for the release name
    const completedCount = releaseFeatures.filter(f => f.status === 'completed').length;
    const inProgressCount = releaseFeatures.filter(f => f.status === 'in_progress').length;
    const pendingCount = releaseFeatures.filter(f => f.status === 'pending').length;
    
    // Create the release
    const releaseName = `Feature Consolidation Release`;
    const releaseDescription = 
      `This release includes ${allFeatures.length} features:\n` +
      `- ${completedCount} completed features\n` +
      `- ${inProgressCount} in-progress features\n` +
      `- ${pendingCount} pending features\n\n` +
      `Generated from system features on ${new Date().toLocaleDateString()}`;
    
    // Use the release management to create the release
    const newReleaseId = releaseManagement.createRelease({
      version: releaseManagement.getNextVersionNumber('minor'),
      name: releaseName,
      type: 'minor',
      status: 'planned',
      plannedReleaseDate: plannedDate,
      description: releaseDescription,
      features: releaseFeatures,
      releaseNotes: [],
      team: [],
      tags: ['auto-generated', 'feature-consolidation']
    });
    
    // Switch to the release tab and select the new release
    setActiveTab('releases');
    
    // Need a small delay to ensure the tab has switched before selecting the release
    setTimeout(() => {
      releaseManagement.setSelectedReleaseId(newReleaseId);
    }, 100);
    
    toast({
      title: "Release Created",
      description: `Successfully created a new release with ${allFeatures.length} features scheduled for ${new Date(plannedDate).toLocaleDateString()}.`
    });
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
    handleAnalyzeFeatures,
    handleCreateReleaseFromFeatures
  };
};
