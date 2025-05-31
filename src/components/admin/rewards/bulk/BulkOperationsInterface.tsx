import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

interface BulkOperationsInterfaceProps {
  onOperationComplete?: (result: any) => void;
}

export function BulkOperationsInterface({ onOperationComplete }: BulkOperationsInterfaceProps) {
  const [operationType, setOperationType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleProcess = async () => {
    if (!operationType || !file) {
      toast.error('Please select operation type and file');
      return;
    }

    setIsProcessing(true);
    try {
      // Mock processing - preserved as placeholder
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${operationType} operation completed successfully`);
      onOperationComplete?.({ type: operationType, file: file.name });
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    // Mock template download - preserved as placeholder
    toast.info('Template download would start here');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Operation Type</Label>
          <Select value={operationType} onValueChange={setOperationType}>
            <SelectTrigger>
              <SelectValue placeholder="Select operation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="import-users">Import Users</SelectItem>
              <SelectItem value="update-points">Update Points</SelectItem>
              <SelectItem value="assign-rewards">Assign Rewards</SelectItem>
              <SelectItem value="export-data">Export Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload File</Label>
          <div className="flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={handleFileUpload}
              className="flex-1"
            />
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
          </div>
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any notes about this operation..."
            rows={3}
          />
        </div>

        <Button 
          onClick={handleProcess} 
          disabled={!operationType || !file || isProcessing}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Process Bulk Operation'}
        </Button>
      </CardContent>
    </Card>
  );
}
