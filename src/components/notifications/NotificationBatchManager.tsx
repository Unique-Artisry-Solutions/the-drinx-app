
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  Pause, 
  Play, 
  Settings, 
  Users,
  Bell,
  BellOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationBatch {
  id: string;
  title: string;
  recipientCount: number;
  status: 'pending' | 'processing' | 'completed' | 'paused';
  progress: number;
  scheduledFor?: Date;
}

interface NotificationBatchManagerProps {
  promoterId: string;
}

const NotificationBatchManager: React.FC<NotificationBatchManagerProps> = ({ promoterId }) => {
  const [batches, setBatches] = useState<NotificationBatch[]>([
    {
      id: '1',
      title: 'Weekly Event Update',
      recipientCount: 1250,
      status: 'pending',
      progress: 0,
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Special Discount Offer',
      recipientCount: 890,
      status: 'processing',
      progress: 45
    }
  ]);

  const [batchSettings, setBatchSettings] = useState({
    batchSize: 100,
    delayBetweenBatches: 5, // seconds
    respectQuietHours: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    preventSpam: true,
    maxNotificationsPerUser: 3
  });

  const { toast } = useToast();

  const handlePauseBatch = (batchId: string) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId 
        ? { ...batch, status: batch.status === 'processing' ? 'paused' : 'processing' }
        : batch
    ));
    
    toast({
      title: 'Batch Updated',
      description: 'Notification batch status changed',
    });
  };

  const getStatusColor = (status: NotificationBatch['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: NotificationBatch['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Play className="h-4 w-4" />;
      case 'completed': return <Bell className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <BellOff className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Batch Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchSize">Batch Size</Label>
              <Input
                id="batchSize"
                type="number"
                value={batchSettings.batchSize}
                onChange={(e) => setBatchSettings(prev => ({ 
                  ...prev, 
                  batchSize: parseInt(e.target.value) || 100 
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delay">Delay Between Batches (seconds)</Label>
              <Input
                id="delay"
                type="number"
                value={batchSettings.delayBetweenBatches}
                onChange={(e) => setBatchSettings(prev => ({ 
                  ...prev, 
                  delayBetweenBatches: parseInt(e.target.value) || 5 
                }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="quietHours">Respect Quiet Hours</Label>
              <Switch
                id="quietHours"
                checked={batchSettings.respectQuietHours}
                onCheckedChange={(checked) => setBatchSettings(prev => ({ 
                  ...prev, 
                  respectQuietHours: checked 
                }))}
              />
            </div>
            
            {batchSettings.respectQuietHours && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Quiet Hours Start</Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={batchSettings.quietHoursStart}
                    onChange={(e) => setBatchSettings(prev => ({ 
                      ...prev, 
                      quietHoursStart: e.target.value 
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">Quiet Hours End</Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={batchSettings.quietHoursEnd}
                    onChange={(e) => setBatchSettings(prev => ({ 
                      ...prev, 
                      quietHoursEnd: e.target.value 
                    }))}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="preventSpam">Prevent Spam</Label>
              <Switch
                id="preventSpam"
                checked={batchSettings.preventSpam}
                onCheckedChange={(checked) => setBatchSettings(prev => ({ 
                  ...prev, 
                  preventSpam: checked 
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Notification Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batches.map((batch) => (
              <div key={batch.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{batch.title}</h4>
                    <Badge className={getStatusColor(batch.status)}>
                      {getStatusIcon(batch.status)}
                      <span className="ml-1">{batch.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {batch.recipientCount}
                    </div>
                    
                    {(batch.status === 'processing' || batch.status === 'paused') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePauseBatch(batch.id)}
                      >
                        {batch.status === 'processing' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {batch.status === 'processing' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{batch.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${batch.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {batch.scheduledFor && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Scheduled for: {batch.scheduledFor.toLocaleDateString()} at {batch.scheduledFor.toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationBatchManager;
