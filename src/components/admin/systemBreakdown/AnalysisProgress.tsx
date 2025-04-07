
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AnalysisStep {
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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          {analyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Implementation
            </>
          ) : (
            <>Analysis Complete</>
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
        
        <div className="space-y-1">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex items-center p-2 rounded-md ${step.completed ? 'bg-green-50' : 'bg-gray-50'}`}
            >
              <div className={`mr-2 h-5 w-5 flex items-center justify-center rounded-full ${
                step.completed ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                {step.completed && <Check className="h-3.5 w-3.5" />}
              </div>
              <span className={step.completed ? 'text-gray-800' : 'text-gray-500'}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisProgress;
