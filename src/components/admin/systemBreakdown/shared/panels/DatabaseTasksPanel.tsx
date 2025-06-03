
import React from 'react';
import { FeatureItem } from '../../types';
import { Database } from 'lucide-react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent 
} from '@/components/ui/accordion';
import { TaskItem } from './TaskItem';
import DatabaseAnalysisPanel from '../../DatabaseAnalysisPanel';

interface DatabaseTasksPanelProps {
  feature: FeatureItem;
}

export const DatabaseTasksPanel: React.FC<DatabaseTasksPanelProps> = ({ feature }) => {
  // Parse the database tasks from the feature's databaseAnalysis
  const renderDatabaseTasks = () => {
    if (feature.databaseAnalysis) {
      return <DatabaseAnalysisPanel analysisText={feature.databaseAnalysis} />;
    }
    
    if (feature.id === "reward-program" && feature.dbRequirementsText) {
      return <DatabaseAnalysisPanel analysisText={feature.dbRequirementsText} />;
    }
    
    return (
      <div className="text-sm text-gray-500 italic">
        No database analysis available yet.
      </div>
    );
  };
  
  // If there's no database information, don't show the panel
  if (!feature.databaseAnalysis && !feature.dbRequirementsText && feature.id !== "reward-program") {
    return null;
  }
  
  return (
    <AccordionItem value="database-tasks">
      <AccordionTrigger className="text-sm py-2">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-gray-600" />
          <span>Database Tasks</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        {feature.id === "reward-program" ? (
          <div className="space-y-3 pl-6">
            <h4 className="font-medium text-sm">Enhanced Flexible Schema</h4>
            <TaskItem task={{ 
              text: "Create user_rewards table with JSON configuration field for extensibility", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Implement reward_transactions table with version tracking", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Add reward_tiers table with customizable progression criteria", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Create reward_offerings table with flexible redemption options", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Implement reward_redemptions tracking with complete history", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Add reward_rules table with condition/action patterns for extensible rule engine", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Create analytics views for program performance monitoring", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Implement notification system with customizable templates for point expiration", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Set up partner_establishments table with participation tiers and custom rules", 
              isCompleted: false 
            }} />
            <TaskItem task={{ 
              text: "Add user_reward_preferences for personalized experiences", 
              isCompleted: false 
            }} />
          </div>
        ) : (
          renderDatabaseTasks()
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
