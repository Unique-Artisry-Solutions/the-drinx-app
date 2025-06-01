
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, PlayCircle } from 'lucide-react';

type BulkOperationType = 'add_points' | 'remove_points' | 'set_tier';
type TargetType = 'all_users' | 'specific_users' | 'tier';

const BulkOperationsInterface = () => {
  const [operationType, setOperationType] = useState<BulkOperationType>('add_points');
  const [targetType, setTargetType] = useState<TargetType>('all_users');
  const [pointsValue, setPointsValue] = useState('');
  const [tierValue, setTierValue] = useState('');
  const [userList, setUserList] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExecuteOperation = () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const recentOperations = [
    {
      id: '1',
      type: 'Add Points',
      target: '1,250 users',
      value: '+500 points',
      status: 'completed',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'Set Tier',
      target: '85 users',
      value: 'Gold tier',
      status: 'completed',
      timestamp: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>
            Perform bulk actions on user rewards and tiers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Operation Type</Label>
              <Select 
                value={operationType} 
                onValueChange={(value: BulkOperationType) => setOperationType(value)}
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
              <Label>Target</Label>
              <Select 
                value={targetType} 
                onValueChange={(value: TargetType) => setTargetType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_users">All Users</SelectItem>
                  <SelectItem value="specific_users">Specific Users</SelectItem>
                  <SelectItem value="tier">By Tier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(operationType === 'add_points' || operationType === 'remove_points') && (
            <div>
              <Label>Points Value</Label>
              <Input
                type="number"
                value={pointsValue}
                onChange={(e) => setPointsValue(e.target.value)}
                placeholder="Enter points amount"
              />
            </div>
          )}

          {operationType === 'set_tier' && (
            <div>
              <Label>Tier</Label>
              <Select value={tierValue} onValueChange={setTierValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {targetType === 'specific_users' && (
            <div>
              <Label>User List</Label>
              <Textarea
                value={userList}
                onChange={(e) => setUserList(e.target.value)}
                placeholder="Enter user IDs or emails, one per line"
                rows={4}
              />
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <Label>Operation Progress</Label>
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          )}

          <Button 
            onClick={handleExecuteOperation} 
            disabled={isProcessing}
            className="w-full"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Execute Operation
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Operations</CardTitle>
          <CardDescription>
            View the history of bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOperations.map((operation) => (
              <div key={operation.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{operation.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {operation.target} • {operation.value}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{operation.status}</Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {operation.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperationsInterface;
