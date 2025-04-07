
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
  
  const taskLines = analysisText
    .split('\n')
    .filter(line => line.trim().match(/^\d+\./)); // Get only numbered lines
  
  // Import isTaskCompleted function from taskDetection.ts
  const { isTaskCompleted } = require('./taskDetection');
  
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

  // Import isTaskCompleted function from taskDetection.ts
  const { isTaskCompleted } = require('./taskDetection');
  
  const taskLines = analysisText
    .split('\n')
    .filter(line => line.trim().match(/^\d+\./)); // Get only numbered lines
  
  return taskLines.map(line => {
    // Extract just the task description without the number
    const taskText = line.replace(/^\d+\.\s*/, '').trim();
    
    return { 
      text: taskText,
      isCompleted: isTaskCompleted(line)
    };
  });
};
