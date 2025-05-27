
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { promoterNotificationService, type FollowerNotificationRequest } from '@/services/PromoterNotificationService';
import { Send, Users, Crown, Mail } from 'lucide-react';

interface FollowerNotificationFormProps {
  promoterId: string;
  eventId?: string;
  onNotificationSent?: () => void;
}

export const FollowerNotificationForm: React.FC<FollowerNotificationFormProps> = ({
  promoterId,
  eventId,
  onNotificationSent
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [segments, setSegments] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as const,
    targetAudience: 'all' as 'all' | 'free' | 'premium' | 'specific_tiers',
    selectedTiers: [] as string[],
    discountCode: '',
    includeDiscount: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFollowerSegments();
  }, [promoterId]);

  const loadFollowerSegments = async () => {
    try {
      const data = await promoterNotificationService.getFollowerSegments(promoterId);
      setSegments(data);
    } catch (error: any) {
      console.error('Error loading follower segments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load follower segments',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in both title and content',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const notification: FollowerNotificationRequest = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        targetAudience: {
          followerType: formData.targetAudience === 'specific_tiers' ? undefined : formData.targetAudience,
          tierIds: formData.targetAudience === 'specific_tiers' ? formData.selectedTiers : undefined
        },
        eventId,
        discountCode: formData.includeDiscount ? formData.discountCode : undefined
      };

      const result = await promoterNotificationService.notifyFollowers(promoterId, notification);

      if (result.success) {
        toast({
          title: 'Notification Sent',
          description: `Successfully sent to ${result.notificationsSent} followers`
        });
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          priority: 'medium',
          targetAudience: 'all',
          selectedTiers: [],
          discountCode: '',
          includeDiscount: false
        });

        onNotificationSent?.();
      } else {
        throw new Error(result.errors?.[0] || 'Failed to send notifications');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTargetCount = () => {
    if (!segments) return 0;
    
    switch (formData.targetAudience) {
      case 'all':
        return segments.total;
      case 'free':
        return segments.free;
      case 'premium':
        return segments.premium;
      case 'specific_tiers':
        return formData.selectedTiers.reduce((total, tierId) => {
          return total + (segments.tiers[tierId]?.count || 0);
        }, 0);
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Notification to Followers
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message Content */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Notification title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your message to followers..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
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
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <label className="block text-sm font-medium">Target Audience</label>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, targetAudience: 'all', selectedTiers: [] }))}
                className={`p-3 rounded-lg border text-left ${
                  formData.targetAudience === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">All Followers</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {segments?.total || 0} followers
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, targetAudience: 'free', selectedTiers: [] }))}
                className={`p-3 rounded-lg border text-left ${
                  formData.targetAudience === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Free Followers</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {segments?.free || 0} followers
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, targetAudience: 'premium', selectedTiers: [] }))}
                className={`p-3 rounded-lg border text-left ${
                  formData.targetAudience === 'premium' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <span className="font-medium">Premium Followers</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {segments?.premium || 0} followers
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, targetAudience: 'specific_tiers' }))}
                className={`p-3 rounded-lg border text-left ${
                  formData.targetAudience === 'specific_tiers' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <span className="font-medium">Specific Tiers</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Choose tiers
                </div>
              </button>
            </div>

            {/* Tier Selection */}
            {formData.targetAudience === 'specific_tiers' && segments?.tiers && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Tiers:</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(segments.tiers).map(([tierId, tier]: [string, any]) => (
                    <label key={tierId} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={formData.selectedTiers.includes(tierId)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              selectedTiers: [...prev.selectedTiers, tierId]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              selectedTiers: prev.selectedTiers.filter(id => id !== tierId)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">
                        {tier.name} ({tier.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Target Recipients:</span>
              <Badge variant="secondary">
                {getTargetCount()} followers
              </Badge>
            </div>
          </div>

          {/* Discount Code Option */}
          {eventId && (
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.includeDiscount}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, includeDiscount: !!checked }))
                  }
                />
                <span className="text-sm font-medium">Include discount code</span>
              </label>

              {formData.includeDiscount && (
                <Input
                  value={formData.discountCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountCode: e.target.value }))}
                  placeholder="Enter discount code..."
                />
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || getTargetCount() === 0}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : `Send to ${getTargetCount()} followers`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationForm;
