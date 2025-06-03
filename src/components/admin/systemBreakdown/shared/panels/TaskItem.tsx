
import React from 'react';
import { Check, CircleDashed } from 'lucide-react';

interface TaskItemProps {
  task: {
    text: string;
    isCompleted: boolean;
  };
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div className="flex items-start gap-2">
      {task.isCompleted ? (
        <Check className="h-4 w-4 text-green-500 mt-0.5" />
      ) : (
        <CircleDashed className="h-4 w-4 text-gray-300 mt-0.5" />
      )}
      <span className={`text-sm ${task.isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
        {task.text}
      </span>
    </div>
  );
};
