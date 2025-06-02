
import React from 'react';
import { Code, Database, LineChart, Shield } from 'lucide-react';
import ComparisonItem from '../components/ComparisonItem';
import { Progress } from '@/components/ui/progress';

interface ComparisonTabProps {
  frontendProgressPercentage: number;
  backendProgressPercentage: number;
  confidenceScore?: number;
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({
  frontendProgressPercentage,
  backendProgressPercentage,
  confidenceScore
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Code className="h-5 w-5 text-purple-500 mr-2" />
            Frontend Implementation
          </h3>
          <div className="space-y-4">
            <ComparisonItem 
              label="UI Components" 
              percentage={frontendProgressPercentage + 5} 
              color="bg-purple-500" 
            />
            <ComparisonItem 
              label="User Interactions" 
              percentage={frontendProgressPercentage} 
              color="bg-purple-400" 
            />
            <ComparisonItem 
              label="Form Validations" 
              percentage={frontendProgressPercentage - 10} 
              color="bg-purple-300" 
            />
            <ComparisonItem 
              label="Responsive Design" 
              percentage={frontendProgressPercentage - 5} 
              color="bg-purple-200" 
            />
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Database className="h-5 w-5 text-green-500 mr-2" />
            Backend Implementation
          </h3>
          <div className="space-y-4">
            <ComparisonItem 
              label="Database Schema" 
              percentage={backendProgressPercentage + 10} 
              color="bg-green-500" 
            />
            <ComparisonItem 
              label="API Endpoints" 
              percentage={backendProgressPercentage} 
              color="bg-green-400" 
            />
            <ComparisonItem 
              label="Data Validation" 
              percentage={backendProgressPercentage - 5} 
              color="bg-green-300" 
            />
            <ComparisonItem 
              label="Authentication" 
              percentage={backendProgressPercentage + 5} 
              color="bg-green-200" 
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 border rounded-lg p-4">
        <h3 className="text-lg font-medium flex items-center mb-3">
          <LineChart className="h-5 w-5 text-blue-500 mr-2" />
          Development Gap Analysis
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Feature Completion Parity</span>
              <span className="text-sm font-medium">
                {Math.abs(frontendProgressPercentage - backendProgressPercentage)}% gap
              </span>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div 
                className="bg-purple-500" 
                style={{ width: `${frontendProgressPercentage}%` }}
              ></div>
              <div 
                className="bg-green-500" 
                style={{ width: `${Math.max(0, backendProgressPercentage - frontendProgressPercentage)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Frontend: {frontendProgressPercentage}%</span>
              <span>Backend: {backendProgressPercentage}%</span>
            </div>
          </div>
        </div>
        
        {confidenceScore !== undefined && (
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between mb-1 items-center">
              <span className="text-sm font-medium flex items-center gap-1">
                <Shield className="h-4 w-4 text-blue-500" />
                Data Confidence
              </span>
              <span className="text-sm font-medium">{confidenceScore}%</span>
            </div>
            <Progress value={confidenceScore} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              Confidence score represents the consistency and reliability of the implementation analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTab;
