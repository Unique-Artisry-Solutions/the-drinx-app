
import React from 'react';
import { Check, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DatabaseAnalysisTaskProps {
  text: string;
  isCompleted: boolean;
}

const DatabaseAnalysisTask: React.FC<DatabaseAnalysisTaskProps> = ({ text, isCompleted }) => (
  <div className="flex items-start gap-2 py-1">
    {isCompleted ? (
      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
    ) : (
      <Circle className="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" />
    )}
    <span className={`text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>{text}</span>
  </div>
);

interface DatabaseAnalysisPanelProps {
  analysisText: string;
}

const DatabaseAnalysisPanel: React.FC<DatabaseAnalysisPanelProps> = ({ analysisText }) => {
  // Parse the analysis text to extract tasks
  // Format expected: numbered list with each item on a new line
  // Example: "1. Create user_rewards table\n2. Implement reward_transactions..."
  const taskLines = analysisText
    .split('\n')
    .filter(line => line.trim().match(/^\d+\./)); // Get only numbered lines
  
  // For demo purposes, we'll consider tasks completed based on specific keywords
  // In a real implementation, this would be based on actual database state
  const taskStatuses = taskLines.map(line => {
    // Extract just the task description without the number
    const taskText = line.replace(/^\d+\.\s*/, '').trim();
    
    // Improved completion detection logic
    // Consider tasks completed if they DON'T contain specific keywords indicating incomplete status
    const isCompleted = !line.toLowerCase().includes('need') && 
                        !line.toLowerCase().includes('required') &&
                        !line.toLowerCase().includes('add') &&
                        !line.toLowerCase().includes('create') &&
                        !line.toLowerCase().includes('implement') &&
                        !line.toLowerCase().includes('todo');
    
    return { 
      text: taskText,
      isCompleted 
    };
  });
  
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

// Helper function to analyze database requirements and determine status
export const analyzeDbRequirements = (analysisText: string) => {
  if (!analysisText) return { completionPercentage: 0, hasStarted: false, isComplete: false };
  
  const taskLines = analysisText
    .split('\n')
    .filter(line => line.trim().match(/^\d+\./)); // Get only numbered lines
  
  // More robust task status detection
  const taskStatuses = taskLines.map(line => {
    return !line.toLowerCase().includes('need') && 
           !line.toLowerCase().includes('required') &&
           !line.toLowerCase().includes('add') &&
           !line.toLowerCase().includes('create') &&
           !line.toLowerCase().includes('implement') &&
           !line.toLowerCase().includes('todo');
  });
  
  const completedCount = taskStatuses.filter(status => status).length;
  const totalTasks = taskStatuses.length;
  const completionPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  
  return {
    completionPercentage,
    // If at least one task is completed, consider it started
    hasStarted: completedCount > 0,
    // Only mark as complete if all tasks are completed
    isComplete: completedCount > 0 && completedCount === totalTasks
  };
};

export default DatabaseAnalysisPanel;
