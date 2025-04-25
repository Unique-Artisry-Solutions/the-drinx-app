
import React from 'react';
import { Database } from 'lucide-react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent 
} from '@/components/ui/accordion';
import { TaskItem } from './TaskItem';
import { AlertCircle } from 'lucide-react';
import { FeatureItem } from '../../types';

interface DatabaseTasksPanelProps {
  feature: FeatureItem;
}

const getDatabaseTasks = (feature: FeatureItem) => {
  const tasks = parseTaskStatuses(feature.databaseAnalysis);
  if (tasks.length === 0) {
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

const parseTaskStatuses = (analysisText?: string): { text: string; isCompleted: boolean }[] => {
  if (!analysisText) return [];
  
  const tasks: { text: string; isCompleted: boolean }[] = [];
  const lines = analysisText.split('\n');
  
  for (const line of lines) {
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
      tasks.push({
        text: line.trim(),
        isCompleted: false
      });
    } else if (line.includes('✓')) {
      tasks.push({
        text: line.replace('✓', '').trim(),
        isCompleted: true
      });
    }
  }
  
  return tasks;
};

export const DatabaseTasksPanel: React.FC<DatabaseTasksPanelProps> = ({ feature }) => {
  const tasks = getDatabaseTasks(feature);

  return (
    <AccordionItem value="database">
      <AccordionTrigger className="text-sm py-2">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-purple-600" />
          <span>Database Implementation Details</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-2 pl-6">
          {tasks.map((task, index) => (
            <TaskItem key={index} task={task} />
          ))}
          
          {tasks.length === 0 && (
            <div className="flex items-center gap-2 text-gray-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">No database tasks defined</span>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
