
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  analyzeAllFeatures, 
  mapFeaturesToReleaseFeatures, 
  getDateMonthsFromNow,
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
} from '../utils';
import { 
  FeatureItem, 
  AnalysisStep, 
  ProgressSnapshot, 
  MonthlyProgressData 
} from '../types';
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
  
  // Track progress history for accurate dashboard data
  const [progressHistory, setProgressHistory] = useState<ProgressSnapshot[]>([]);
  const [monthlyProgressData, setMonthlyProgressData] = useState<MonthlyProgressData[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<ProgressSnapshot | null>(null);
  const [dataValidation, setDataValidation] = useState<{ isValid: boolean, issues: string[] }>({ isValid: true, issues: [] });
  
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
  
  // Initialize project status on first load
  useEffect(() => {
    // Create initial snapshot without saving to history
    const initialSnapshot = createProgressSnapshot(
      adminFeatures,
      establishmentFeatures,
      individualFeatures
    );
    
    setCurrentSnapshot(initialSnapshot);
    
    // Generate initial monthly progress data based on current state
    generateHistoricalProgressDataAndUpdate(initialSnapshot);
  }, []);

  // Helper function to generate historical data and update state
  const generateHistoricalProgressDataAndUpdate = (
    snapshot: ProgressSnapshot,
    history: ProgressSnapshot[] = []
  ) => {
    // Import and call the function
    generateHistoricalProgressData(snapshot, history)
      .then(data => {
        // Update the state with the resulting data
        setMonthlyProgressData(data);
      })
      .catch(error => {
        console.error("Error generating historical progress data:", error);
        // Fallback with a simple implementation if import fails
        const currentMonth = new Date().getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const fallbackData = Array.from({ length: currentMonth + 1 }, (_, i) => {
          const progressRatio = (i + 1) / (currentMonth + 1);
          return {
            month: monthNames[i],
            frontend: Math.round(snapshot.frontendProgress * progressRatio),
            backend: Math.round(snapshot.backendProgress * progressRatio * 0.85)
          };
        });
        
        setMonthlyProgressData(fallbackData);
      });
  };

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
      
      // Create a new progress snapshot after analysis
      const newSnapshot = createProgressSnapshot(
        analyzedFeatures.adminFeatures,
        analyzedFeatures.establishmentFeatures,
        analyzedFeatures.individualFeatures
      );
      
      // Validate the progress data
      const validationResult = validateProgressData(newSnapshot);
      setDataValidation(validationResult);
      
      // Update current snapshot
      setCurrentSnapshot(newSnapshot);
      
      // Add new snapshot to history
      setProgressHistory(prevHistory => [...prevHistory, newSnapshot]);
      
      // Generate updated monthly progress data
      generateHistoricalProgressDataAndUpdate(newSnapshot, [...progressHistory, newSnapshot]);
      
      // Show analysis completion message
      let completionMessage = `${totalUpdated} feature status${totalUpdated !== 1 ? 'es' : ''} updated based on database implementation.`;
      
      if (!validationResult.isValid) {
        completionMessage += " Warning: Some data inconsistencies detected.";
      }
      
      toast({
        title: "Analysis Complete",
        description: completionMessage,
        variant: validationResult.isValid ? "default" : "destructive"
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
  
  // Helper function to generate historical data
  const generateHistoricalProgressData = (
    snapshot: ProgressSnapshot,
    history: ProgressSnapshot[] = []
  ): MonthlyProgressData[] => {
    // Import the function dynamically to avoid circular dependencies
    return import('../utils/statisticsUtils').then(({ generateHistoricalProgressData }) => {
      return generateHistoricalProgressData(snapshot, history);
    }).catch(() => {
      // Fallback with a simple implementation if import fails
      const currentMonth = new Date().getMonth();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return Array.from({ length: currentMonth + 1 }, (_, i) => {
        const progressRatio = (i + 1) / (currentMonth + 1);
        return {
          month: monthNames[i],
          frontend: Math.round(snapshot.frontendProgress * progressRatio),
          backend: Math.round(snapshot.backendProgress * progressRatio * 0.85)
        };
      });
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
    handleCreateReleaseFromFeatures,
    // Expose additional state for Dashboard
    progressHistory,
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  };
};
