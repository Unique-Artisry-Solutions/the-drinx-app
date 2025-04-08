
import React from 'react';
import { Check, Loader2, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { AnalysisStep } from './types';

interface ProgressStepWithNameAndStatus {
  name: string;
  completed: boolean;
}

interface AnalysisProgressProps {
  analyzing: boolean;
  steps: AnalysisStep[];
  progress: number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ analyzing, steps, progress }) => {
  if (!analyzing && steps.length === 0) {
    return null;
  }

  // Convert analysis steps to the format needed for rendering
  const progressSteps: ProgressStepWithNameAndStatus[] = steps.map(step => ({
    name: step.status || step.featureName,
    completed: step.completed || true
  }));

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          {analyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Database Implementation
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Database Tasks Analysis
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Analysis Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Database Implementation Tasks:</div>
          <div className="grid grid-cols-1 gap-2">
            {progressSteps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center p-2 rounded-md ${step.completed ? 'bg-green-50' : 'bg-gray-50'}`}
              >
                <Checkbox 
                  id={`task-${index}`}
                  checked={step.completed} 
                  className="mr-3"
                  disabled={analyzing}
                />
                <label 
                  htmlFor={`task-${index}`}
                  className={`text-sm flex-1 ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}
                >
                  {step.name}
                </label>
                {step.completed && (
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {!analyzing && progressSteps.some(step => !step.completed) && (
          <div className="mt-4 pl-4 border-l-2 border-blue-400 bg-blue-50 p-3 rounded">
            <p className="text-sm text-blue-800">
              Some database tasks haven't been completed. These might affect the implementation status of certain features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisProgress;
