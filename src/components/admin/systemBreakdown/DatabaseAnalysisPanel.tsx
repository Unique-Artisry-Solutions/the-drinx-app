
import React from 'react';
import { Progress } from '@/components/ui/progress';
import DatabaseAnalysisTask from './components/DatabaseAnalysisTask';
import { parseTaskStatuses, analyzeDbRequirements } from './utils/analysisHelpers';

interface DatabaseAnalysisPanelProps {
  analysisText: string;
}

/**
 * Panel that displays database analysis information and task completion progress
 */
const DatabaseAnalysisPanel: React.FC<DatabaseAnalysisPanelProps> = ({ analysisText }) => {
  const taskStatuses = parseTaskStatuses(analysisText);
  const completedCount = taskStatuses.filter(task => task.isCompleted).length;
  const totalTasks = taskStatuses.length;
  const completionPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  
  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-medium">Implementation Progress</span>
        <span>{Math.round(completionPercentage)}%</span>
      </div>
      <Progress value={completionPercentage} className="h-2 mb-4" />
      
      <div className="space-y-1">
        {taskStatuses.map((task, index) => (
          <DatabaseAnalysisTask 
            key={index} 
            text={task.text} 
            isCompleted={task.isCompleted} 
          />
        ))}
      </div>
    </div>
  );
};

export default DatabaseAnalysisPanel;
