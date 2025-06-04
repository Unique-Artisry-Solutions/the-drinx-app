
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AudienceSegment } from '@/types/AudienceTypes';

export interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segments: AudienceSegment[];
  selectedSegments: string[];
  onSegmentToggle: (segmentId: string) => void;
}

export const ExportReportDialog: React.FC<ExportReportDialogProps> = ({
  open,
  onOpenChange,
  segments,
  selectedSegments,
  onSegmentToggle
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Audience Report</DialogTitle>
          <DialogDescription>
            Select segments to include in your export report
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Export report dialog placeholder. This component will allow
            users to configure and export audience reports.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportDialog;
