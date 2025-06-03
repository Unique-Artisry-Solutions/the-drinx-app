
import React from 'react';
import { Check, Circle } from 'lucide-react';

interface DatabaseAnalysisTaskProps {
  text: string;
  isCompleted: boolean;
}

/**
 * Component that displays a single database task with completion status
 */
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

export default DatabaseAnalysisTask;
