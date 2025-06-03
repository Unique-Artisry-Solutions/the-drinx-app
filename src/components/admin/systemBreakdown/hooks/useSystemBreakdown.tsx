
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FeatureItem, AnalysisStep } from '../types';
import { analyzeAllFeatureSets } from '../utils/SimpleAnalysis';

// Create proper mock features that match the FeatureItem interface
const createMockFeature = (id: string, name: string, description: string, status: 'implemented' | 'in_progress' | 'planned' | 'blocked' | 'partial' = 'implemented'): FeatureItem => ({
  id,
  name,
  description,
  status,
  adminAccess: 'full',
  establishmentAccess: 'partial',
  individualAccess: 'read',
  promoterAccess: 'read',
  databaseStatus: 'complete',
  userImpact: 'medium',
  complexity: 'medium'
});

const mockFeatures: FeatureItem[] = [
  createMockFeature('feature-1', 'User Management', 'Complete user management system', 'implemented'),
  createMockFeature('feature-2', 'Authentication', 'User authentication and authorization', 'in_progress'),
  createMockFeature('feature-3', 'Analytics Dashboard', 'Comprehensive analytics and reporting', 'planned'),
  createMockFeature('feature-4', 'Reward System', 'User rewards and loyalty program', 'implemented'),
  createMockFeature('feature-5', 'Event Management', 'Event creation and management tools', 'in_progress')
];

export const useSystemBreakdown = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Distribute features across user types
  const adminFeatures = mockFeatures.filter((_, index) => index % 4 === 0 || index % 4 === 1);
  const establishmentFeatures = mockFeatures.filter((_, index) => index % 4 === 1 || index % 4 === 2);
  const individualFeatures = mockFeatures.filter((_, index) => index % 4 === 2 || index % 4 === 3);
  const promoterFeatures = mockFeatures.filter((_, index) => index % 4 === 0 || index % 4 === 3);

  const analysisSteps: AnalysisStep[] = [
    { name: 'Analyzing system components...', completed: false },
    { name: 'Checking database integrity...', completed: false },
    { name: 'Validating user permissions...', completed: false },
    { name: 'Generating report...', completed: false }
  ];

  const handleLogout = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleExportCSV = useCallback(() => {
    toast({
      title: 'Export Started',
      description: 'Your CSV export will download shortly.',
    });
  }, [toast]);

  const handleAnalyzeFeatures = useCallback(async () => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    
    for (let i = 0; i <= 100; i += 25) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalysisProgress(i);
    }
    
    // Use simplified analysis
    const analysis = analyzeAllFeatureSets(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures
    );
    
    setAnalyzing(false);
    toast({
      title: 'Analysis Complete',
      description: `System analysis completed. Overall completion: ${analysis.overall.completionRate}%`,
    });
  }, [toast, adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);

  const handleCreateReleaseFromFeatures = useCallback(() => {
    toast({
      title: 'Release Created',
      description: 'A new release has been created from selected features.',
    });
  }, [toast]);

  return {
    activeTab,
    setActiveTab,
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures,
    analyzing,
    analysisProgress,
    analysisSteps,
    updatedFeaturesCount: mockFeatures.length,
    handleLogout,
    handleExportCSV,
    handleAnalyzeFeatures,
    handleCreateReleaseFromFeatures,
    progressHistory: [],
    monthlyProgressData: [],
    currentSnapshot: null,
    dataValidation: { isValid: true, issues: [] }
  };
};
