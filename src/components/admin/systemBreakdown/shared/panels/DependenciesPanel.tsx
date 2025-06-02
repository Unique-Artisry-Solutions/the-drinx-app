
import React from 'react';
import { FileCheck } from 'lucide-react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent 
} from '@/components/ui/accordion';
import { FeatureItem } from '../../types';

interface DependenciesPanelProps {
  feature: FeatureItem;
}

export const DependenciesPanel: React.FC<DependenciesPanelProps> = ({ feature }) => {
  if (!feature.dependsOn || feature.dependsOn.length === 0) {
    return null;
  }

  return (
    <AccordionItem value="dependencies">
      <AccordionTrigger className="text-sm py-2">
        <div className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-gray-600" />
          <span>Dependencies</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-2 pl-6">
          {feature.dependsOn.map((dep, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-sm text-gray-700">
                • {dep}
              </span>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
