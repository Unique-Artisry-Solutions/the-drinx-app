
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  completed: boolean;
  active: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                step.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : step.active
                  ? "bg-spiritless-pink border-spiritless-pink text-white"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              )}
            >
              {step.completed ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="mt-2 text-center">
              <p
                className={cn(
                  "text-xs font-medium",
                  step.active || step.completed
                    ? "text-gray-900"
                    : "text-gray-500"
                )}
              >
                {step.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-12 mx-4 mt-[-20px]",
                index < currentStep ? "bg-green-500" : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
