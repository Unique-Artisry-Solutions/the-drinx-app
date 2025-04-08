
import { isTaskCompleted } from './taskDetection';

interface AnalysisResult {
  completionPercentage: number;
  hasStarted: boolean;
  isComplete: boolean;
}

/**
 * Analyzes the database requirements text and determines the completion status
 */
export const analyzeDbRequirements = (analysisText: string): AnalysisResult => {
  if (!analysisText) return { completionPercentage: 0, hasStarted: false, isComplete: false };
  
  // Parse tasks with the [x] or [ ] format
  const taskLines = analysisText
    .split('\n')
    .filter(line => line.trim().match(/^\s*-\s*\[[\sx]\]/i));
  
  const taskStatuses = taskLines.map(line => isTaskCompleted(line));
  
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

/**
 * Parses the analysis text and returns task status objects
 */
export const parseTaskStatuses = (analysisText: string) => {
  if (!analysisText) return [];
  
  // Parse tasks with the [x] or [ ] format
  const taskLines = analysisText
    .split('\n')
    .filter(line => line.trim().match(/^\s*-\s*\[[\sx]\]/i));
  
  return taskLines.map(line => {
    // Extract just the task description without the checkbox
    const taskText = line.replace(/^\s*-\s*\[[\sx]\]\s*/i, '').trim();
    
    return { 
      text: taskText,
      isCompleted: isTaskCompleted(line)
    };
  });
};
