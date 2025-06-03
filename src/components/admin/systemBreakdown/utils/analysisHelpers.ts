
import { FeatureItem } from '../types';

/**
 * Parses database requirements or analysis text to identify tasks and their completion status
 */
export function parseTaskStatuses(analysisText?: string): { text: string; isCompleted: boolean }[] {
  if (!analysisText) return [];
  
  const tasks: { text: string; isCompleted: boolean }[] = [];
  const lines = analysisText.split('\n');
  
  for (const line of lines) {
    // Match markdown-style checkboxes: - [x] task or - [ ] task
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
      // For numbered lists: 1. Create table
      tasks.push({
        text: line.trim(),
        isCompleted: false
      });
    } else if (line.includes('✓')) {
      // Also match checkmarks: ✓ task
      tasks.push({
        text: line.replace('✓', '').trim(),
        isCompleted: true
      });
    }
  }
  
  return tasks;
}

/**
 * Analyzes database requirements for a feature and returns a structured analysis
 */
export function analyzeDbRequirements(feature: FeatureItem): {
  completedTasks: number;
  totalTasks: number;
  tasks: { text: string; isCompleted: boolean }[];
  completionPercentage: number;
} {
  const tasks = parseTaskStatuses(feature.databaseAnalysis);
  
  // If no tasks were found in the analysis, generate default ones based on status
  if (tasks.length === 0) {
    const dbStatus = feature.dbStatus || feature.databaseStatus || 'not_started';
    const isComplete = dbStatus === 'complete';
    const isInProgress = dbStatus === 'in_progress';
    
    const defaultTasks = [
      { text: 'Create database schema', isCompleted: isComplete || isInProgress },
      { text: 'Define table relationships', isCompleted: isComplete || isInProgress },
      { text: 'Implement API endpoints', isCompleted: isComplete },
      { text: 'Create database triggers', isCompleted: isComplete },
      { text: 'Optimize query performance', isCompleted: isComplete }
    ];
    
    tasks.push(...defaultTasks);
  }
  
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return {
    completedTasks,
    totalTasks,
    tasks,
    completionPercentage
  };
}
