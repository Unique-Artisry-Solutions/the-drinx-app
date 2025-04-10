
import React from 'react';

interface StatusProgressBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
  icon: React.ReactNode;
}

const StatusProgressBar: React.FC<StatusProgressBarProps> = ({ label, count, total, color, icon }) => {
  const percentage = Math.round((count / total) * 100);
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="flex items-center">
          {icon}
          <span className="text-sm font-medium ml-2">{label}</span>
        </div>
        <span className="text-sm font-medium">{count}/{total} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full">
        <div 
          className={`${color} h-2 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatusProgressBar;
