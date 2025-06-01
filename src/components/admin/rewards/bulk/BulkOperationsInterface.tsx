import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, Play, Pause, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkOperation {
  type: 'add_points' | 'remove_points' | 'set_tier';
  target: 'all_users' | 'specific_users' | 'tier';
  value: number;
  tier?: string;
  user_list?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  log?: string;
}

const BulkOperationsInterface = () => {
  const [operationType, setOperationType] = useState<BulkOperation['type']>('add_points');
  const [operationTarget, setOperationTarget] = useState<BulkOperation['target']>('all_users');
  const [operationValue, setOperationValue] = useState<number>(0);
  const [targetTier, setTargetTier] = useState<string>('');
  const [userList, setUserList] = useState<string>('');
  const [operationStatus, setOperationStatus] = useState<BulkOperation['status']>('pending');
  const [operationProgress, setOperationProgress] = useState<number>(0);
  const [operationLog, setOperationLog] = useState<string>('');
  const { toast } = useToast();

  const handleOperationStart = () => {
    console.log('Starting bulk operation with:', {
      type: operationType,
      target: operationTarget,
      value: operationValue,
      tier: targetTier,
      userList: userList
    });

    setOperationStatus('processing');
    setOperationProgress(10);

    setTimeout(() => {
      setOperationProgress(50);
      setOperationLog('Processing users...');
    }, 2000);

    setTimeout(() => {
      setOperationProgress(90);
      setOperationLog('Finalizing operation...');
    }, 5000);

    setTimeout(() => {
      setOperationStatus('completed');
      setOperationProgress(100);
      setOperationLog('Operation completed successfully.');
      toast({
        title: "Bulk operation completed",
        description: "The bulk operation has been completed successfully.",
      });
    }, 7000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserList(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>
            Perform bulk actions on users, such as adding points, removing points, or setting tiers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operationType">Operation Type</Label>
              <Select
                id="operationType"
                value={operationType}
                onValueChange={setOperationType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add_points">Add Points</SelectItem>
                  <SelectItem value="remove_points">Remove Points</SelectItem>
                  <SelectItem value="set_tier">Set Tier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="operationTarget">Operation Target</Label>
              <Select
                id="operationTarget"
                value={operationTarget}
                onValueChange={setOperationTarget}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_users">All Users</SelectItem>
                  <SelectItem value="specific_users">Specific Users</SelectItem>
                  <SelectItem value="tier">Tier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {operationTarget === 'tier' && (
            <div className="space-y-2">
              <Label htmlFor="targetTier">Target Tier</Label>
              <Input
                id="targetTier"
                type="text"
                placeholder="Enter tier name"
                value={targetTier}
                onChange={(e) => setTargetTier(e.target.value)}
              />
            </div>
          )}

          {operationTarget === 'specific_users' && (
            <div className="space-y-2">
              <Label htmlFor="userList">User List (CSV)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  id="userList"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Label htmlFor="userList" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md">
                  <Upload className="h-4 w-4 mr-2 inline-block" />
                  Upload CSV
                </Label>
                {userList && (
                  <Badge variant="secondary">
                    <FileText className="h-4 w-4 mr-1" />
                    File Uploaded
                  </Badge>
                )}
              </div>
              <Textarea
                placeholder="Paste user IDs (comma-separated)"
                value={userList}
                onChange={(e) => setUserList(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="operationValue">Value</Label>
            <Input
              id="operationValue"
              type="number"
              placeholder="Enter value"
              value={operationValue}
              onChange={(e) => setOperationValue(Number(e.target.value))}
            />
          </div>

          <Button onClick={handleOperationStart} disabled={operationStatus === 'processing'}>
            {operationStatus === 'processing' ? (
              <>
                <Pause className="h-4 w-4 mr-2 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Operation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {operationStatus !== 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Operation Status</CardTitle>
            <CardDescription>
              Real-time status and progress of the bulk operation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{operationProgress}%</span>
              </div>
              <Progress value={operationProgress} />
            </div>

            <div className="space-y-2">
              <Label>Log</Label>
              <Textarea
                readOnly
                value={operationLog}
                rows={4}
                className="bg-gray-100"
              />
            </div>

            <div className="flex justify-end">
              <Badge variant={operationStatus === 'completed' ? 'default' : operationStatus === 'failed' ? 'destructive' : 'secondary'}>
                {operationStatus.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkOperationsInterface;
