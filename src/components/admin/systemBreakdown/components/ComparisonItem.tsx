
import React from 'react';

interface ComparisonItemProps {
  label: string;
  percentage: number;
  color: string;
}

const ComparisonItem: React.FC<ComparisonItemProps> = ({ label, percentage, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm">{label}</span>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full">
      <div 
        className={`${color} h-2 rounded-full`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default ComparisonItem;
