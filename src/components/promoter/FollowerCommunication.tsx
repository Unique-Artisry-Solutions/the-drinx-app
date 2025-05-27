
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFollowers } from '@/hooks/useFollowers';
import { useAuth } from '@/contexts/auth';
import { Mail, Image, Tag, Users } from 'lucide-react';

interface FollowerCommunicationProps {
  promoterId: string;
}

export const FollowerCommunication: React.FC<FollowerCommunicationProps> = ({ promoterId }) => {
  const { user } = useAuth();
  const { sendNotification, sendFlyer, sendDiscountCode } = useFollowers();
  
  const [activeTab, setActiveTab] = useState<'notification' | 'flyer' | 'discount'>('notification');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    flyerUrl: '',
    discountCode: '',
    expiresAt: '',
    targetTiers: [] as string[]
  });

  const handleSendNotification = async () => {
    if (!user || !formData.title || !formData.content) return;

    await sendNotification.mutateAsync({
      promoterId,
      notification: {
        title: formData.title,
        content: formData.content,
        type: 'announcement'
      },
      targetTiers: formData.targetTiers.length > 0 ? formData.targetTiers : undefined
    });

    setFormData({ ...formData, title: '', content: '' });
  };

  const handleSendFlyer = async () => {
    if (!user || !formData.title || !formData.content || !formData.flyerUrl) return;

    await sendFlyer.mutateAsync({
      promoterId,
      flyerUrl: formData.flyerUrl,
      title: formData.title,
      description: formData.content,
      targetTiers: formData.targetTiers.length > 0 ? formData.targetTiers : undefined
    });

    setFormData({ ...formData, title: '', content: '', flyerUrl: '' });
  };

  const handleSendDiscountCode = async () => {
    if (!user || !formData.title || !formData.content || !formData.discountCode) return;

    await sendDiscountCode.mutateAsync({
      promoterId,
      discountCode: formData.discountCode,
      title: formData.title,
      description: formData.content,
      expiresAt: formData.expiresAt || undefined,
      targetTiers: formData.targetTiers.length > 0 ? formData.targetTiers : undefined
    });

    setFormData({ 
      ...formData, 
      title: '', 
      content: '', 
      discountCode: '', 
      expiresAt: '' 
    });
  };

  const isLoading = sendNotification.isPending || sendFlyer.isPending || sendDiscountCode.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Communicate with Followers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === 'notification' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('notification')}
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-2" />
            Announcement
          </Button>
          <Button
            variant={activeTab === 'flyer' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('flyer')}
            className="flex-1"
          >
            <Image className="h-4 w-4 mr-2" />
            Flyer
          </Button>
          <Button
            variant={activeTab === 'discount' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('discount')}
            className="flex-1"
          >
            <Tag className="h-4 w-4 mr-2" />
            Discount
          </Button>
        </div>

        {/* Common Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter a title for your message"
            />
          </div>

          <div>
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your message to followers..."
              rows={4}
            />
          </div>

          {/* Flyer URL Field */}
          {activeTab === 'flyer' && (
            <div>
              <Label htmlFor="flyerUrl">Flyer Image URL</Label>
              <Input
                id="flyerUrl"
                type="url"
                value={formData.flyerUrl}
                onChange={(e) => setFormData({ ...formData, flyerUrl: e.target.value })}
                placeholder="https://example.com/flyer.jpg"
              />
            </div>
          )}

          {/* Discount Code Fields */}
          {activeTab === 'discount' && (
            <>
              <div>
                <Label htmlFor="discountCode">Discount Code</Label>
                <Input
                  id="discountCode"
                  value={formData.discountCode}
                  onChange={(e) => setFormData({ ...formData, discountCode: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                />
              </div>

              <div>
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Target Tiers Selection */}
          <div>
            <Label>Target Audience</Label>
            <Select
              value={formData.targetTiers.length > 0 ? 'custom' : 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setFormData({ ...formData, targetTiers: [] });
                }
                // For custom targeting, you'd implement tier selection logic here
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Followers</SelectItem>
                <SelectItem value="free">Free Followers Only</SelectItem>
                <SelectItem value="premium">Premium Subscribers Only</SelectItem>
                <SelectItem value="custom">Custom Selection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Send Button */}
        <Button 
          onClick={() => {
            switch (activeTab) {
              case 'notification':
                handleSendNotification();
                break;
              case 'flyer':
                handleSendFlyer();
                break;
              case 'discount':
                handleSendDiscountCode();
                break;
            }
          }}
          disabled={isLoading || !formData.title || !formData.content}
          className="w-full"
        >
          {isLoading ? 'Sending...' : `Send ${activeTab === 'notification' ? 'Announcement' : activeTab === 'flyer' ? 'Flyer' : 'Discount Code'}`}
        </Button>
      </CardContent>
    </Card>
  );
};
