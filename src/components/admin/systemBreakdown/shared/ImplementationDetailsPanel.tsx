
import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  CircleDashed, 
  Check,
  AlertCircle, 
  Database,
  Code,
  TestTube,
  FileCheck
} from 'lucide-react';
import { FeatureItem } from '../types';

interface ImplementationDetailsPanelProps {
  feature: FeatureItem;
}

export const ImplementationDetailsPanel: React.FC<ImplementationDetailsPanelProps> = ({ feature }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const parseDatabaseTasks = (analysisText?: string): { text: string; isCompleted: boolean }[] => {
    if (!analysisText) return [];
    
    const tasks: { text: string; isCompleted: boolean }[] = [];
    const lines = analysisText.split('\n');
    
    for (const line of lines) {
      // Match markdown checkboxes: - [x] task or - [ ] task
      if (line.includes('- [x]')) {
        tasks.push({
          text: line.replace('- [x]', '').trim(),
          isCompleted: true
        });
      } else if (line.includes('- [ ]')) {
        tasks.push({
          text: line.replace('- [ ]', '').trim(),
          isCompleted: false
        });
      } else if (line.match(/^\d+\.\s+/)) {
        // For numbered lists: 1. Create table
        tasks.push({
          text: line.trim(),
          isCompleted: false
        });
      } else if (line.includes('✓')) {
        // Also match checkmarks: ✓ task
        tasks.push({
          text: line.replace('✓', '').trim(),
          isCompleted: true
        });
      }
    }
    
    return tasks;
  };

  const getDatabaseTasks = () => {
    const tasks = parseDatabaseTasks(feature.databaseAnalysis);
    if (tasks.length === 0) {
      // Generate default tasks if none were parsed
      const dbStatus = feature.dbStatus || feature.databaseStatus || 'not_started';
      const isComplete = dbStatus === 'complete' || dbStatus === 'implemented';
      const isInProgress = dbStatus === 'in_progress';
      
      return [
        { text: 'Create database schema', isCompleted: isComplete || isInProgress },
        { text: 'Define table relationships', isCompleted: isComplete || isInProgress },
        { text: 'Implement API endpoints', isCompleted: isComplete },
        { text: 'Create database triggers', isCompleted: isComplete },
        { text: 'Optimize query performance', isCompleted: isComplete }
      ];
    }
    return tasks;
  };

  const getTestSteps = () => {
    if (feature.testSteps && feature.testSteps.length > 0) {
      return feature.testSteps.map(step => ({
        text: step,
        isCompleted: feature.status === 'implemented'
      }));
    }
    
    // Default test steps if none provided
    return [
      { text: 'Unit testing', isCompleted: feature.status === 'implemented' },
      { text: 'Integration testing', isCompleted: feature.status === 'implemented' },
      { text: 'User acceptance testing', isCompleted: feature.status === 'implemented' },
      { text: 'Performance testing', isCompleted: feature.status === 'implemented' }
    ];
  };

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full"
      value={expanded || undefined}
      onValueChange={(value) => setExpanded(value)}
    >
      <AccordionItem value="database">
        <AccordionTrigger className="text-sm py-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-600" />
            <span>Database Implementation Details</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div className="space-y-2 pl-6">
            {getDatabaseTasks().map((task, index) => (
              <div key={index} className="flex items-start gap-2">
                {task.isCompleted ? (
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                ) : (
                  <CircleDashed className="h-4 w-4 text-gray-300 mt-0.5" />
                )}
                <span className={`text-sm ${task.isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
                  {task.text}
                </span>
              </div>
            ))}
            
            {getDatabaseTasks().length === 0 && (
              <div className="flex items-center gap-2 text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">No database tasks defined</span>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="ui">
        <AccordionTrigger className="text-sm py-2">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-blue-600" />
            <span>UI Implementation Details</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div className="space-y-2 pl-6">
            {/* UI tasks - typically based on feature's implementation status */}
            {[
              { text: 'Component design', isCompleted: feature.status !== 'planned' && feature.status !== 'not_started' },
              { text: 'State management', isCompleted: feature.status !== 'planned' && feature.status !== 'not_started' },
              { text: 'API integration', isCompleted: feature.status === 'implemented' || feature.status === 'partial' },
              { text: 'Responsive design', isCompleted: feature.status === 'implemented' },
              { text: 'Accessibility compliance', isCompleted: feature.status === 'implemented' }
            ].map((task, index) => (
              <div key={index} className="flex items-start gap-2">
                {task.isCompleted ? (
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                ) : (
                  <CircleDashed className="h-4 w-4 text-gray-300 mt-0.5" />
                )}
                <span className={`text-sm ${task.isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="testing">
        <AccordionTrigger className="text-sm py-2">
          <div className="flex items-center gap-2">
            <TestTube className="h-4 w-4 text-amber-600" />
            <span>Testing Details</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div className="space-y-2 pl-6">
            {getTestSteps().map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                {step.isCompleted ? (
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                ) : (
                  <CircleDashed className="h-4 w-4 text-gray-300 mt-0.5" />
                )}
                <span className={`text-sm ${step.isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {feature.dependsOn && feature.dependsOn.length > 0 && (
        <AccordionItem value="dependencies">
          <AccordionTrigger className="text-sm py-2">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-gray-600" />
              <span>Dependencies</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-2 pl-6">
              {feature.dependsOn.map((dep, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-700">
                    • {dep}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
