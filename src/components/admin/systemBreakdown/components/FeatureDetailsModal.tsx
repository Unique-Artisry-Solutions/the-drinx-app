
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FeatureItem } from '../types';
import { Database, GitBranch, CheckSquare } from 'lucide-react';

interface FeatureDetailsModalProps {
  feature: FeatureItem;
  isOpen: boolean;
  onClose: () => void;
}

const FeatureDetailsModal: React.FC<FeatureDetailsModalProps> = ({
  feature,
  isOpen,
  onClose,
}) => {
  const groupTestStepsByPhase = (steps: string[]) => {
    const phases: { [key: string]: string[] } = {};
    let currentPhase = '';

    steps.forEach(step => {
      if (step.includes('Phase')) {
        currentPhase = step;
        phases[currentPhase] = [];
      } else if (currentPhase) {
        phases[currentPhase].push(step);
      }
    });

    return phases;
  };

  const phasedSteps = feature.testSteps ? groupTestStepsByPhase(feature.testSteps) : {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{feature.name}</DialogTitle>
          <DialogDescription>{feature.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-4">
          <div>
            <div className="text-sm font-medium mb-1">Implementation Progress</div>
            <div className="flex items-center gap-2">
              <Progress value={feature.implementationProgress} className="w-[180px]" />
              <span className="text-sm">{feature.implementationProgress}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Complexity</div>
            <Badge variant="secondary">{feature.complexity}</Badge>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">User Impact</div>
            <Badge variant="secondary">{feature.userImpact}</Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          {feature.testSteps && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Implementation Phases
                </h3>
                <div className="grid gap-4">
                  {Object.entries(phasedSteps).map(([phase, steps]) => (
                    <div key={phase} className="space-y-2">
                      <h4 className="font-medium">{phase}</h4>
                      <ul className="space-y-1">
                        {steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckSquare className="h-4 w-4 mt-1 text-gray-400" />
                            <span>{step.replace('- ', '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {feature.dbRequirementsText && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Requirements
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap">
                      {feature.dbRequirementsText}
                    </pre>
                  </div>
                </div>
              )}

              <Separator />

              {feature.dependsOn && feature.dependsOn.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dependencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {feature.dependsOn.map(dep => (
                      <Badge key={dep} variant="outline">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {feature.scheduledFor && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Scheduled For</h3>
                  <Badge variant="secondary">{feature.scheduledFor}</Badge>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureDetailsModal;
