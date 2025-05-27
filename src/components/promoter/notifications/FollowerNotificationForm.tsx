
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { promoterNotificationService, type FollowerNotificationRequest, type FollowerSegment } from '@/services/PromoterNotificationService';

interface FollowerNotificationFormProps {
  promoterId: string;
  onNotificationSent?: (result: { success: boolean; sentCount: number }) => void;
}

export const FollowerNotificationForm: React.FC<FollowerNotificationFormProps> = ({
  promoterId,
  onNotificationSent
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [segments, setSegments] = useState<FollowerSegment[]>([]);
  const [notification, setNotification] = useState<FollowerNotificationRequest>({
    targetType: 'all',
    title: '',
    message: '',
    priority: 'medium',
    includeEmail: false,
    includePush: false
  });

  const { toast } = useToast();

  useEffect(() => {
    loadSegments();
  }, [promoterId]);

  const loadSegments = async () => {
    try {
      const followerSegments = await promoterNotificationService.getFollowerSegments(promoterId);
      setSegments(followerSegments);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load follower segments',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notification.title.trim() || !notification.message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and message are required',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await promoterNotificationService.notifyFollowers(promoterId, notification);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Notification sent to ${result.sentCount} followers`
        });
        
        // Reset form
        setNotification({
          targetType: 'all',
          title: '',
          message: '',
          priority: 'medium',
          includeEmail: false,
          includePush: false
        });
        
        onNotificationSent?.(result);
      } else {
        toast({
          title: 'Partial Success',
          description: `Sent to ${result.sentCount} followers. ${result.errors.length} errors occurred.`,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send notifications',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotification = (updates: Partial<FollowerNotificationRequest>) => {
    setNotification(prev => ({ ...prev, ...updates }));
  };

  const getSegmentInfo = (targetType: string) => {
    const segment = segments.find(s => s.id === targetType);
    return segment ? `${segment.count} followers` : '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification to Followers</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="target-type">Target Audience</Label>
            <Select
              value={notification.targetType}
              onValueChange={(value: any) => updateNotification({ targetType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Followers ({getSegmentInfo('all')})</SelectItem>
                <SelectItem value="free">Free Followers ({getSegmentInfo('free')})</SelectItem>
                <SelectItem value="premium">Premium Followers ({getSegmentInfo('premium')})</SelectItem>
                <SelectItem value="specific_tiers">Specific Tiers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specific Tiers Selection */}
          {notification.targetType === 'specific_tiers' && (
            <div className="space-y-2">
              <Label>Select Tiers</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {segments
                  .filter(s => s.type === 'tier')
                  .map((segment) => (
                    <div key={segment.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tier-${segment.id}`}
                        checked={notification.specificTiers?.includes(segment.id) || false}
                        onCheckedChange={(checked) => {
                          const currentTiers = notification.specificTiers || [];
                          const newTiers = checked
                            ? [...currentTiers, segment.id]
                            : currentTiers.filter(id => id !== segment.id);
                          updateNotification({ specificTiers: newTiers });
                        }}
                      />
                      <Label htmlFor={`tier-${segment.id}`}>
                        {segment.name} ({segment.count})
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={notification.title}
              onChange={(e) => updateNotification({ title: e.target.value })}
              placeholder="Enter notification title"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={notification.message}
              onChange={(e) => updateNotification({ message: e.target.value })}
              placeholder="Enter your message to followers"
              rows={4}
              required
            />
          </div>

          {/* Discount Code */}
          <div className="space-y-2">
            <Label htmlFor="discount-code">Discount Code (Optional)</Label>
            <Input
              id="discount-code"
              value={notification.discountCode || ''}
              onChange={(e) => updateNotification({ discountCode: e.target.value })}
              placeholder="Enter discount code"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={notification.priority}
              onValueChange={(value: any) => updateNotification({ priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delivery Options */}
          <div className="space-y-4">
            <Label>Delivery Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-email"
                  checked={notification.includeEmail || false}
                  onCheckedChange={(checked) => updateNotification({ includeEmail: !!checked })}
                />
                <Label htmlFor="include-email">Send Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-push"
                  checked={notification.includePush || false}
                  onCheckedChange={(checked) => updateNotification({ includePush: !!checked })}
                />
                <Label htmlFor="include-push">Send Push Notifications</Label>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sending...' : 'Send Notification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationForm;
