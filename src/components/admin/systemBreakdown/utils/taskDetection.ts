
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
    taskDescription.toLowerCase().includes('finished')
  ) {
    return true;
  }
  
  return false;
};
