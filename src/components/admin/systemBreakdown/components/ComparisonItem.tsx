
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ComparisonItemProps {
  label: string;
  value1?: string | number;
  value2?: string | number;
  label1?: string;
  label2?: string;
  percentage?: number;
  color?: string;
}

const ComparisonItem: React.FC<ComparisonItemProps> = ({
  label,
  value1,
  value2,
  label1 = "Previous",
  label2 = "Current",
  percentage
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-medium text-sm text-gray-600 mb-2">{label}</h4>
        {percentage !== undefined ? (
          <div className="text-lg font-semibold">{percentage}%</div>
        ) : (
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-gray-500">{label1}</div>
              <div className="text-lg font-semibold">{value1}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">{label2}</div>
              <div className="text-lg font-semibold">{value2}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonItem;
