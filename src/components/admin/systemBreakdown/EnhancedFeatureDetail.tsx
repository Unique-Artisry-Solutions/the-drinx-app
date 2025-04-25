
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeatureItem } from './types';
import { FeatureImplementationStatus } from './shared/FeatureImplementationStatus';
import { FeaturePhasesDisplay } from './shared/FeaturePhasesDisplay';
import { ImplementationDetailsPanel } from './shared/ImplementationDetailsPanel';
import { Badge } from '@/components/ui/badge';

interface EnhancedFeatureDetailProps {
  feature: FeatureItem;
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedFeatureDetail: React.FC<EnhancedFeatureDetailProps> = ({
  feature,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{feature.name}</DialogTitle>
            {feature.complexity && (
              <Badge variant="outline">
                {feature.complexity} complexity
              </Badge>
            )}
          </div>
          <DialogDescription>{feature.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 mt-4">
          <div className="space-y-8 pb-4">
            <FeatureImplementationStatus feature={feature} />
            
            <FeaturePhasesDisplay feature={feature} />
            
            <ImplementationDetailsPanel feature={feature} />
            
            {feature.scheduledFor && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Scheduled Release</div>
                <Badge className="bg-blue-100 text-blue-800">{feature.scheduledFor}</Badge>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedFeatureDetail;
