
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  percentage: number;
  description: string;
  icon: React.ReactNode;
  confidenceScore?: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, percentage, description, icon, confidenceScore }) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-lg font-medium">{title}</h3>
      {icon}
    </div>
    <div className="text-3xl font-bold mb-2">{percentage}%</div>
    <div className="mb-2">
      <Progress value={percentage} className="h-2" />
    </div>
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{description}</p>
      {confidenceScore !== undefined && (
        <Badge variant="outline" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          {confidenceScore}%
        </Badge>
      )}
    </div>
  </div>
);

export default ProgressCard;
