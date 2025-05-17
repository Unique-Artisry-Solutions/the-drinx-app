
import * as React from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  activeStep: number;
  steps: string[];
  className?: string;
}

export function Steps({ activeStep, steps, className }: StepsProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className="flex items-center">
              <div className="h-px w-4 bg-muted-foreground/30" />
            </div>
          )}
          <div
            className={cn(
              "flex items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground transition-colors",
              activeStep === index
                ? "border-primary bg-primary text-primary-foreground"
                : index < activeStep
                ? "border-primary bg-primary/20 text-primary"
                : ""
            )}
          >
            <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold">
              {index < activeStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export interface StepsLabelProps {
  activeStep: number;
  steps: string[];
  className?: string;
}

export function StepsLabel({ activeStep, steps, className }: StepsLabelProps) {
  return (
    <div className={cn("flex justify-between", className)}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "text-xs font-medium text-muted-foreground",
            activeStep >= index && "text-foreground"
          )}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
