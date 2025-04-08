
import { FeatureItem } from '../types';

/**
 * Checks if a task is completed based on its description
 * Supports both [x] format and ✅ format
 */
export const isTaskCompleted = (taskDescription: string): boolean => {
  // Check for [x] format (case insensitive)
  if (taskDescription.match(/\[x\]/i)) {
    return true;
  }
  
  // Check for ✅ emoji
  if (taskDescription.includes('✅')) {
    return true;
  }
  
  // Check for completed/done text
  if (
    taskDescription.toLowerCase().includes('completed') || 
    taskDescription.toLowerCase().includes('done') ||
    taskDescription.toLowerCase().includes('finished') ||
    taskDescription.toLowerCase().includes('implemented')
  ) {
    return true;
  }
  
  return false;
};

// Add a function to parse task statuses from text
export const parseTaskStatuses = (analysisText: string) => {
  if (!analysisText) return [];
  
  // Split the text by lines
  const lines = analysisText.split('\n').filter(line => line.trim() !== '');
  
  // Parse out tasks
  return lines.map(line => {
    const trimmed = line.trim();
    return {
      text: trimmed,
      isCompleted: isTaskCompleted(trimmed)
    };
  });
};

/**
 * Checks the database health for a specific feature
 * This is a mock implementation for demonstration purposes
 */
export const checkDatabaseHealthForFeature = async (feature: FeatureItem) => {
  // In a real implementation, this would check actual database tables related to the feature
  
  // For now, just extract status from the databaseAnalysis field if present
  if (feature.databaseAnalysis) {
    const tasks = parseTaskStatuses(feature.databaseAnalysis);
    const completedCount = tasks.filter(t => t.isCompleted).length;
    const totalCount = tasks.length;
    
    if (totalCount === 0) {
      return {
        status: 'not_started',
        analysis: 'No database implementation tasks found'
      };
    }
    
    if (completedCount === totalCount) {
      return {
        status: 'complete',
        analysis: `All ${totalCount} database tasks completed`
      };
    }
    
    return {
      status: 'in_progress',
      analysis: `${completedCount} of ${totalCount} database tasks completed`
    };
  }
  
  return {
    status: feature.databaseStatus || 'not_started',
    analysis: feature.databaseAnalysis || 'No database analysis available'
  };
};

/**
 * Analyze database requirements from the feature analysis text
 */
export const analyzeDbRequirements = (analysisText: string) => {
  if (!analysisText) return [];
  
  const tasks = parseTaskStatuses(analysisText);
  return tasks;
};
