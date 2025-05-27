
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { promoterNotificationService } from '@/services/PromoterNotificationService';
import { FollowerSegment, FollowerNotificationRequest, NotificationResult } from '@/types/FollowerNotificationTypes';

interface FollowerNotificationFormProps {
  promoterId: string;
}

const FollowerNotificationForm: React.FC<FollowerNotificationFormProps> = ({ promoterId }) => {
  const [segments, setSegments] = useState<FollowerSegment[]>([]);
  const [request, setRequest] = useState<FollowerNotificationRequest>({
    targetType: 'all',
    specificTiers: [],
    message: '',
    discountCode: '',
    includeEmail: true,
    includePush: true,
    title: '',
    priority: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSegments();
  }, [promoterId]);

  const loadSegments = async () => {
    try {
      setIsLoading(true);
      const followerSegments = await promoterNotificationService.getFollowerSegments(promoterId);
      setSegments(followerSegments);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load follower segments',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!request.title || !request.message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in both title and message',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSending(true);
      const result: NotificationResult = await promoterNotificationService.notifyFollowers(promoterId, request);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Notification sent to ${result.sentCount} followers`
        });
        
        // Reset form
        setRequest({
          targetType: 'all',
          specificTiers: [],
          message: '',
          discountCode: '',
          includeEmail: true,
          includePush: true,
          title: '',
          priority: 'medium'
        });
      } else {
        const errorMessage = result.errors?.join(', ') || 'Failed to send notifications';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const getSegmentCount = (segmentId: string) => {
    const segment = segments.find(s => s.id === segmentId);
    return segment?.count || 0;
  };

  if (isLoading) {
    return <div>Loading follower segments...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification to Followers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Target Audience</Label>
          <Select
            value={request.targetType}
            onValueChange={(value: 'all' | 'tier' | 'specific') => 
              setRequest(prev => ({ ...prev, targetType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Followers</SelectItem>
              <SelectItem value="tier">Specific Tiers</SelectItem>
            </SelectContent>
          </Select>
          
          {segments.map(segment => {
            if (segment.type === request.targetType || request.targetType === 'all') {
              return (
                <div key={segment.id} className="text-sm text-gray-600">
                  {segment.name}: {segment.count} followers
                </div>
              );
            }
            return null;
          })}
        </div>

        {request.targetType === 'tier' && (
          <div className="space-y-2">
            <Label>Select Tiers</Label>
            {segments
              .filter(s => s.type === 'tier')
              .map(segment => (
                <div key={segment.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={segment.id}
                    checked={request.specificTiers?.includes(segment.id) || false}
                    onCheckedChange={(checked) => {
                      setRequest(prev => ({
                        ...prev,
                        specificTiers: checked
                          ? [...(prev.specificTiers || []), segment.id]
                          : (prev.specificTiers || []).filter(id => id !== segment.id)
                      }));
                    }}
                  />
                  <Label htmlFor={segment.id}>
                    {segment.name} ({segment.count} followers)
                  </Label>
                </div>
              ))}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Notification title"
            value={request.title}
            onChange={(e) => setRequest(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Your message to followers"
            value={request.message}
            onChange={(e) => setRequest(prev => ({ ...prev, message: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount Code (Optional)</Label>
          <Input
            id="discount"
            placeholder="SAVE20"
            value={request.discountCode}
            onChange={(e) => setRequest(prev => ({ ...prev, discountCode: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={request.priority}
            onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
              setRequest(prev => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Delivery Methods</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email"
              checked={request.includeEmail}
              onCheckedChange={(checked) => setRequest(prev => ({ ...prev, includeEmail: checked as boolean }))}
            />
            <Label htmlFor="email">Email Notification</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="push"
              checked={request.includePush}
              onCheckedChange={(checked) => setRequest(prev => ({ ...prev, includePush: checked as boolean }))}
            />
            <Label htmlFor="push">Push Notification</Label>
          </div>
        </div>

        <Button onClick={handleSend} disabled={isSending} className="w-full">
          {isSending ? 'Sending...' : 'Send Notification'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationForm;
