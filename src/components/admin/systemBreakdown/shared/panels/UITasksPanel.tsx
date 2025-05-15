
import React from 'react';
import { Code } from 'lucide-react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent 
} from '@/components/ui/accordion';
import { TaskItem } from './TaskItem';
import { FeatureItem, FeatureStatus } from '../../types';

interface UITasksPanelProps {
  feature: FeatureItem;
}

const isFeatureInProgress = (status: string): boolean => {
  return ['in_progress', 'partial', 'implemented'].includes(status as FeatureStatus);
};

const isFeatureComplete = (status: string): boolean => {
  return status === 'implemented' || status === 'completed';
};

export const UITasksPanel: React.FC<UITasksPanelProps> = ({ feature }) => {
  const tasks = [
    { text: 'Component design', isCompleted: isFeatureInProgress(feature.status) },
    { text: 'State management', isCompleted: isFeatureInProgress(feature.status) },
    { text: 'API integration', isCompleted: (feature.status === 'implemented' || feature.status === 'partial') },
    { text: 'Responsive design', isCompleted: isFeatureComplete(feature.status) },
    { text: 'Accessibility compliance', isCompleted: isFeatureComplete(feature.status) }
  ];

  return (
    <AccordionItem value="ui">
      <AccordionTrigger className="text-sm py-2">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-blue-600" />
          <span>UI Implementation Details</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-2 pl-6">
          {tasks.map((task, index) => (
            <TaskItem key={index} task={task} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
