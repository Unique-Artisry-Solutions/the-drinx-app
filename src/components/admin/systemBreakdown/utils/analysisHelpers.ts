
import { FeatureItem } from '../types';

/**
 * Simple task parser - extracts checkbox-style tasks from text
 */
export function parseTaskStatuses(analysisText?: string): { text: string; isCompleted: boolean }[] {
  if (!analysisText) return [];
  
  const tasks: { text: string; isCompleted: boolean }[] = [];
  const lines = analysisText.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes('- [x]')) {
      tasks.push({
        text: trimmed.replace('- [x]', '').trim(),
        isCompleted: true
      });
    } else if (trimmed.includes('- [ ]')) {
      tasks.push({
        text: trimmed.replace('- [ ]', '').trim(),
        isCompleted: false
      });
    }
  }
  
  return tasks;
}

/**
 * Simplified database requirements analysis
 */
export function analyzeDbRequirements(feature: FeatureItem): {
  completedTasks: number;
  totalTasks: number;
  tasks: { text: string; isCompleted: boolean }[];
  completionPercentage: number;
} {
  const tasks = parseTaskStatuses(feature.databaseAnalysis);
  
  // If no specific tasks found, create simple defaults based on status
  if (tasks.length === 0) {
    const dbStatus = feature.dbStatus || feature.databaseStatus || 'not_started';
    const defaultTasks = [
      { text: 'Database schema', isCompleted: dbStatus === 'complete' },
      { text: 'API endpoints', isCompleted: dbStatus === 'complete' },
      { text: 'Data validation', isCompleted: dbStatus === 'complete' }
    ];
    tasks.push(...defaultTasks);
  }
  
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return {
    completedTasks,
    totalTasks,
    tasks,
    completionPercentage
  };
}
