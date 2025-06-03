
import React from 'react';
import { Calendar, AlertCircle, Shield } from 'lucide-react';
import { MonthlyProgressData } from '../types';

interface TimelineTabProps {
  monthlyProgress: MonthlyProgressData[];
  confidenceScore?: number;
}

const TimelineTab: React.FC<TimelineTabProps> = ({
  monthlyProgress,
  confidenceScore
}) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium flex items-center mb-3">
          <Calendar className="h-5 w-5 text-blue-500 mr-2" />
          Monthly Progress Timeline
        </h3>
        <div className="space-y-4 mt-4">
          {monthlyProgress.map((month, index) => (
            <div key={month.month} className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{month.month}</span>
                <div className="flex gap-4">
                  <span className="text-xs text-purple-600">FE: {month.frontend}%</span>
                  <span className="text-xs text-green-600">BE: {month.backend}%</span>
                </div>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div 
                    className="bg-purple-500 h-full"
                    style={{ width: `${month.frontend}%` }}
                  ></div>
                  <div 
                    className="bg-green-500 h-full"
                    style={{ width: `${Math.max(0, month.backend - month.frontend)}%` }}
                  ></div>
                </div>
              </div>
              {index < monthlyProgress.length - 1 && (
                <div className="h-6 border-l ml-1 my-1"></div>
              )}
            </div>
          ))}
        </div>
        
        {confidenceScore !== undefined && confidenceScore < 90 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              Timeline data is partially reconstructed and may not reflect precise historical progress.
              Run analysis regularly to improve data confidence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineTab;
