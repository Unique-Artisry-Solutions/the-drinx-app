
/**
 * Checks if a task is completed based on its description
 * Supports both [x] format and ✅ format
 */
export const isTaskCompleted = (taskDescription: string): boolean => {
  if (!taskDescription) return false;
  
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
    taskDescription.toLowerCase().includes('finished')
  ) {
    return true;
  }
  
  return false;
};

/**
 * Parse tasks from a string, returning an array of task objects
 */
export const parseTasks = (taskString: string): { text: string; isCompleted: boolean }[] => {
  if (!taskString) return [];
  
  const tasks = taskString.split('\n').filter(line => line.trim());
  
  return tasks.map(task => ({
    text: task.replace(/\[x\]/i, '').replace('✅', '').trim(),
    isCompleted: isTaskCompleted(task)
  }));
};
