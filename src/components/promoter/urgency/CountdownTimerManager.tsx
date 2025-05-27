
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CountdownTimer } from '@/components/ui/countdown';
import { Plus, Edit, Trash, Timer, Eye } from 'lucide-react';

interface TimerData {
  id: string;
  title: string;
  description?: string;
  target_datetime: string;
  timer_type: string;
  is_active: boolean;
  urgency_message?: string;
  event_id?: string;
  swig_circuit_id?: string;
}

interface CountdownTimerManagerProps {
  promoterId: string;
  eventId?: string;
  swigCircuitId?: string;
  onCreateTimer?: () => void;
  onEditTimer?: (timer: TimerData) => void;
}

export const CountdownTimerManager: React.FC<CountdownTimerManagerProps> = ({
  promoterId,
  eventId,
  swigCircuitId,
  onCreateTimer,
  onEditTimer
}) => {
  // Mock data for now - in real implementation, this would come from a hook
  const [timers] = useState<TimerData[]>([
    {
      id: '1',
      title: 'Early Bird Sale Ends',
      description: 'Last chance to get discounted tickets',
      target_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      timer_type: 'early_bird',
      is_active: true,
      urgency_message: 'Limited time offer!',
      event_id: eventId
    },
    {
      id: '2',
      title: 'Event Starts',
      description: 'Don\'t miss out on this amazing event',
      target_datetime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      timer_type: 'event_start',
      is_active: true,
      event_id: eventId
    }
  ]);

  const [updatingTimers, setUpdatingTimers] = useState<Set<string>>(new Set());

  const getTimerTypeColor = (type: string) => {
    switch (type) {
      case 'event_start': return 'bg-blue-100 text-blue-800';
      case 'sale_end': return 'bg-red-100 text-red-800';
      case 'early_bird': return 'bg-green-100 text-green-800';
      case 'flash_sale': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimerType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Countdown Timers
        </CardTitle>
        <Button onClick={onCreateTimer} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Timer
        </Button>
      </CardHeader>
      <CardContent>
        {timers.length === 0 ? (
          <div className="text-center py-8">
            <Timer className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground mb-4">No countdown timers created yet</p>
            <Button onClick={onCreateTimer} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Timer
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {timers.map((timer) => (
              <div key={timer.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{timer.title}</h4>
                      <Badge className={getTimerTypeColor(timer.timer_type)}>
                        {formatTimerType(timer.timer_type)}
                      </Badge>
                      <Badge variant={timer.is_active ? 'default' : 'secondary'}>
                        {timer.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {timer.description && (
                      <p className="text-sm text-muted-foreground">
                        {timer.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={timer.is_active}
                      disabled={updatingTimers.has(timer.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTimer?.(timer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Timer Preview */}
                {timer.is_active && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Preview:
                    </div>
                    <CountdownTimer
                      targetDate={timer.target_datetime}
                      title={timer.title}
                      description={timer.description}
                      urgencyMessage={timer.urgency_message}
                      className="max-w-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
