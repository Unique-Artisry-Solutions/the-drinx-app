
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFeatures as initialAdminFeatures } from '../features/adminFeatures';
import { establishmentFeatures as initialEstablishmentFeatures } from '../features/establishmentFeatures';
import { individualFeatures as initialIndividualFeatures } from '../features/individualFeatures';
import { FeatureItem, FeatureStatus, AnalysisStep } from '../types';
import { analyzeFeatures } from '../utils/featureAnalysis';
import { exportFeaturesCSV } from '../utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

// Helper function to convert string status to FeatureStatus type
const convertToFeatureStatus = (status: string): FeatureStatus => {
  switch (status) {
    case 'implemented':
      return 'implemented';
    case 'in-progress':
      return 'in-progress';
    case 'planned':
      return 'planned';
    case 'not-started':
      return 'not-started';
    default:
      return 'not-started';
  }
};

// Convert initial features to proper FeatureItem type
const convertFeatures = (features: any[]): FeatureItem[] => {
  return features.map(feature => ({
    ...feature,
    status: convertToFeatureStatus(feature.status)
  }));
};

export function useSystemBreakdown() {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminFeatures, setAdminFeatures] = useState<FeatureItem[]>(convertFeatures(initialAdminFeatures));
  const [establishmentFeatures, setEstablishmentFeatures] = useState<FeatureItem[]>(convertFeatures(initialEstablishmentFeatures));
  const [individualFeatures, setIndividualFeatures] = useState<FeatureItem[]>(convertFeatures(initialIndividualFeatures));
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [updatedFeaturesCount, setUpdatedFeaturesCount] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = useCallback(() => {
    // Logout implementation
    navigate('/admin/login');
  }, [navigate]);

  const handleExportCSV = useCallback(() => {
    try {
      exportFeaturesCSV({ adminFeatures, establishmentFeatures, individualFeatures });
      toast({
        title: "Export successful",
        description: "System breakdown has been exported to CSV.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Could not export system breakdown data.",
        variant: "destructive",
      });
    }
  }, [adminFeatures, establishmentFeatures, individualFeatures, toast]);

  const handleAnalyzeFeatures = useCallback(async () => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisSteps([]);
    
    try {
      const result = await analyzeFeatures({
        onProgress: (progress) => setAnalysisProgress(progress),
        onStep: (step) => setAnalysisSteps(prev => [...prev, step]),
      });
      
      setAdminFeatures(convertFeatures(result.adminFeatures));
      setEstablishmentFeatures(convertFeatures(result.establishmentFeatures));
      setIndividualFeatures(convertFeatures(result.individualFeatures));
      setUpdatedFeaturesCount(result.completedSteps.length);
      
      toast({
        title: "Analysis complete",
        description: `Analyzed ${result.completedSteps.length} features.`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not complete feature analysis.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  }, [toast]);

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
}
