
import React from 'react';
import { Zap } from 'lucide-react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent 
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { FeatureItem } from '../../types';

interface RewardSystemPanelProps {
  feature: FeatureItem;
}

export const RewardSystemPanel: React.FC<RewardSystemPanelProps> = ({ feature }) => {
  // Only show for the reward program feature
  if (feature.id !== "reward-program") {
    return null;
  }
  
  return (
    <AccordionItem value="reward-system">
      <AccordionTrigger className="text-sm py-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>Reward System Architecture</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 space-y-4">
        <div className="space-y-3 pl-6">
          <h4 className="font-medium text-sm">Enhanced Flexibility Features</h4>
          
          <div className="space-y-1">
            <div className="flex justify-between mb-1 text-xs">
              <span className="font-medium">JSON Configuration</span>
              <span className="text-gray-500">Design Complete</span>
            </div>
            <Progress value={100} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1">
              JSON fields for storing extensible metadata and custom configurations
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between mb-1 text-xs">
              <span className="font-medium">Rules Engine</span>
              <span className="text-gray-500">Design Phase</span>
            </div>
            <Progress value={60} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1">
              Condition/action pattern for defining extensible reward rules
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between mb-1 text-xs">
              <span className="font-medium">API Layer</span>
              <span className="text-gray-500">Planning</span>
            </div>
            <Progress value={30} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1">
              Abstraction layer between database and UI components
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between mb-1 text-xs">
              <span className="font-medium">Version Control</span>
              <span className="text-gray-500">Designed</span>
            </div>
            <Progress value={80} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1">
              Tracking changes to rewards and rules for backward compatibility
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between mb-1 text-xs">
              <span className="font-medium">User Preferences</span>
              <span className="text-gray-500">Planning</span>
            </div>
            <Progress value={20} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1">
              Personalization capabilities for reward program experience
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
