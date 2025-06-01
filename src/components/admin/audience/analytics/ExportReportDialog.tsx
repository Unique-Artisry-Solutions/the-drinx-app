
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportReportDialog({ open, onOpenChange }: ExportReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Tabs defaultValue="csv">
            <TabsList>
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button>Export</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
