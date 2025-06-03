
import React from 'react';
import { TestTube } from 'lucide-react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent 
} from '@/components/ui/accordion';
import { TaskItem } from './TaskItem';
import { FeatureItem } from '../../types';

interface TestingPanelProps {
  feature: FeatureItem;
}

const getTestSteps = (feature: FeatureItem) => {
  if (feature.testSteps && feature.testSteps.length > 0) {
    return feature.testSteps.map(step => ({
      text: step,
      isCompleted: feature.status === 'implemented'
    }));
  }
  
  return [
    { text: 'Unit testing', isCompleted: feature.status === 'implemented' },
    { text: 'Integration testing', isCompleted: feature.status === 'implemented' },
    { text: 'User acceptance testing', isCompleted: feature.status === 'implemented' },
    { text: 'Performance testing', isCompleted: feature.status === 'implemented' }
  ];
};

export const TestingPanel: React.FC<TestingPanelProps> = ({ feature }) => {
  const testSteps = getTestSteps(feature);

  return (
    <AccordionItem value="testing">
      <AccordionTrigger className="text-sm py-2">
        <div className="flex items-center gap-2">
          <TestTube className="h-4 w-4 text-amber-600" />
          <span>Testing Details</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-2 pl-6">
          {testSteps.map((step, index) => (
            <TaskItem key={index} task={step} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
