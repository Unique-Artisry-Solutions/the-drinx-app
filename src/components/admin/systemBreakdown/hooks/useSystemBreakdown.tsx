
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data for now - replace with actual implementation
const mockFeatures = [
  {
    id: 'feature-1',
    name: 'User Management',
    description: 'Complete user management system',
    status: 'completed',
    progress: 100
  },
  {
    id: 'feature-2',
    name: 'Authentication',
    description: 'User authentication and authorization',
    status: 'in_progress',
    progress: 75
  }
];

export const useSystemBreakdown = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock feature data
  const adminFeatures = mockFeatures.filter(() => Math.random() > 0.5);
  const establishmentFeatures = mockFeatures.filter(() => Math.random() > 0.5);
  const individualFeatures = mockFeatures.filter(() => Math.random() > 0.5);
  const promoterFeatures = mockFeatures.filter(() => Math.random() > 0.5);

  const analysisSteps = [
    'Analyzing system components...',
    'Checking database integrity...',
    'Validating user permissions...',
    'Generating report...'
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
    
    setAnalyzing(false);
    toast({
      title: 'Analysis Complete',
      description: 'System analysis has been completed successfully.',
    });
  }, [toast]);

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
    dataValidation: { isValid: true, errors: [] }
  };
};
