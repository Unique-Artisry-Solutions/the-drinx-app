
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress: number;
  dependencies?: string[];
}

export interface MigrationState {
  steps: MigrationStep[];
  currentStep: string | null;
  isRunning: boolean;
  overallProgress: number;
}

export interface MigrationActions {
  startMigration: () => void;
  pauseMigration: () => void;
  resumeMigration: () => void;
  resetMigration: () => void;
  skipStep: (stepId: string) => void;
  retryStep: (stepId: string) => void;
}

const migrationSteps: MigrationStep[] = [
  {
    id: 'layout-conversion',
    title: 'Convert Admin Pages to New Layout',
    description: 'Migrate existing admin pages to use AdminPageLayout component',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'hook-integration',
    title: 'Integrate Reusable Hooks',
    description: 'Replace page-specific logic with reusable admin hooks',
    status: 'pending',
    progress: 0,
    dependencies: ['layout-conversion'],
  },
  {
    id: 'navigation-standardization',
    title: 'Standardize Navigation',
    description: 'Implement consistent navigation patterns across all pages',
    status: 'pending',
    progress: 0,
    dependencies: ['layout-conversion'],
  },
  {
    id: 'cleanup-legacy',
    title: 'Clean Up Legacy Code',
    description: 'Remove duplicate components and unused code',
    status: 'pending',
    progress: 0,
    dependencies: ['layout-conversion', 'hook-integration', 'navigation-standardization'],
  },
];

export const useAdminMigration = () => {
  const [state, setState] = useState<MigrationState>({
    steps: migrationSteps,
    currentStep: null,
    isRunning: false,
    overallProgress: 0,
  });
  const { toast } = useToast();

  const calculateOverallProgress = useCallback((steps: MigrationStep[]) => {
    const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0);
    return Math.round(totalProgress / steps.length);
  }, []);

  const updateStepStatus = useCallback((stepId: string, updates: Partial<MigrationStep>) => {
    setState(prev => {
      const updatedSteps = prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      );
      return {
        ...prev,
        steps: updatedSteps,
        overallProgress: calculateOverallProgress(updatedSteps),
      };
    });
  }, [calculateOverallProgress]);

  const actions: MigrationActions = {
    startMigration: () => {
      setState(prev => ({ ...prev, isRunning: true, currentStep: 'layout-conversion' }));
      updateStepStatus('layout-conversion', { status: 'in-progress' });
      toast({
        title: 'Migration Started',
        description: 'Admin system migration is now in progress',
      });
    },

    pauseMigration: () => {
      setState(prev => ({ ...prev, isRunning: false }));
      toast({
        title: 'Migration Paused',
        description: 'You can resume the migration at any time',
      });
    },

    resumeMigration: () => {
      setState(prev => ({ ...prev, isRunning: true }));
      toast({
        title: 'Migration Resumed',
        description: 'Continuing with the migration process',
      });
    },

    resetMigration: () => {
      setState({
        steps: migrationSteps.map(step => ({ ...step, status: 'pending', progress: 0 })),
        currentStep: null,
        isRunning: false,
        overallProgress: 0,
      });
      toast({
        title: 'Migration Reset',
        description: 'All migration steps have been reset',
      });
    },

    skipStep: (stepId: string) => {
      updateStepStatus(stepId, { status: 'completed', progress: 100 });
      toast({
        title: 'Step Skipped',
        description: `Migration step "${stepId}" has been skipped`,
      });
    },

    retryStep: (stepId: string) => {
      updateStepStatus(stepId, { status: 'in-progress', progress: 0 });
      toast({
        title: 'Step Retrying',
        description: `Retrying migration step "${stepId}"`,
      });
    },
  };

  return { state, actions };
};
