
import React, { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { FeatureItem } from '../types';
import { DatabaseTasksPanel } from './panels/DatabaseTasksPanel';
import { UITasksPanel } from './panels/UITasksPanel';
import { TestingPanel } from './panels/TestingPanel';
import { DependenciesPanel } from './panels/DependenciesPanel';
import { RewardSystemPanel } from './panels/RewardSystemPanel';

interface ImplementationDetailsPanelProps {
  feature: FeatureItem;
}

export const ImplementationDetailsPanel: React.FC<ImplementationDetailsPanelProps> = ({ feature }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full"
      value={expanded || undefined}
      onValueChange={(value) => setExpanded(value)}
    >
      <DatabaseTasksPanel feature={feature} />
      <UITasksPanel feature={feature} />
      <TestingPanel feature={feature} />
      <RewardSystemPanel feature={feature} />
      <DependenciesPanel feature={feature} />
    </Accordion>
  );
};
